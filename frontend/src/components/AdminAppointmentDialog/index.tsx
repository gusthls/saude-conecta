import { useForm } from "react-hook-form";
import { useMemo, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";

export interface AdminAppointmentFormData {
    patientName: string;
    date: string;
    time: string;
    specialty: string;
    medic: string;
}

interface AdminAppointmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (
        data: AdminAppointmentFormData
    ) => void;
}

type Medic = { medic_id: number | string; name: string; specialty_id?: number; };

// We'll fetch medics from the API and derive specialties

// Função para gerar horários disponíveis (07h até 20h com intervalos de 30 minutos)
function generateAvailableTimes(): string[] {
    const times: string[] = [];
    for (let hour = 7; hour < 20; hour++) {
        times.push(`${String(hour).padStart(2, "0")}:00`);
        times.push(`${String(hour).padStart(2, "0")}:30`);
    }
    times.push("20:00");
    return times;
}

export function AdminAppointmentDialog({
    open,
    onOpenChange,
    onSubmit,
}: AdminAppointmentDialogProps) {
    const [specialties, setSpecialties] = useState<{ id: number; name: string }[]>([]);
    const [medics, setMedics] = useState<Medic[]>([]);
    const [patients, setPatients] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                // Buscar especialidades
                const specsRes = await fetch('http://localhost:3000/api/specialties');
                if (!specsRes.ok) return;
                const specsData = await specsRes.json();
                if (!mounted) return;
                setSpecialties(specsData);

                // Buscar médicos
                const medicsRes = await fetch('http://localhost:3000/api/medics');
                if (!medicsRes.ok) return;
                const medicsData = await medicsRes.json();
                if (!mounted) return;
                setMedics(
                    medicsData.map((m: any) => ({
                        medic_id: m.id || m.medic_id,
                        name: m.name,
                        specialty_id: m.specialty_id,
                    }))
                );

                // Buscar pacientes ativos
                const patientsRes = await fetch('http://localhost:3000/api/patients');
                if (!patientsRes.ok) {
                    console.warn('Erro ao buscar pacientes:', patientsRes.status);
                    return;
                }
                const patientsData = await patientsRes.json();
                console.debug('Pacientes carregados:', patientsData);
                if (!mounted) return;
                const activePatients = patientsData
                    .filter((p: any) => p.active === 1 || p.active === true)
                    .map((p: any) => ({ id: p.id, name: p.name }));
                console.debug('Pacientes ativos filtrados:', activePatients);
                setPatients(activePatients);
            } catch (e) {
                console.warn('Erro ao buscar dados:', e);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const medicsBySpecialty = useMemo(() => {
        const map: Record<number, string[]> = {};
        medics.forEach((m) => {
            if (!m.specialty_id) return;
            if (!map[m.specialty_id]) map[m.specialty_id] = [];
            if (m.name) map[m.specialty_id].push(m.name);
        });
        return map;
    }, [medics]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<AdminAppointmentFormData>();

    const selectedSpecialtyId =
        watch("specialty");

    const availableTimes = useMemo(
        () => generateAvailableTimes(),
        []
    );

    const filteredDoctors = useMemo(() => {
        if (!selectedSpecialtyId) {
            return [];
        }
        const specId = parseInt(selectedSpecialtyId, 10);
        return medicsBySpecialty[specId] || [];
    }, [selectedSpecialtyId, medicsBySpecialty]);

    // Obter a data mínima (hoje)
    const today = new Date();
    const minDate = today
        .toISOString()
        .split("T")[0];

    const handleFormSubmit = async (
        data: AdminAppointmentFormData
    ) => {
        try {
            // Buscar médico pelo nome
            const selectedMedic = medics.find(m => m.name === data.medic);
            if (!selectedMedic) {
                console.error('Médico não encontrado');
                return;
            }

            const selectedPatient = patients.find((p) => String(p.id) === data.patientName);
            if (!selectedPatient) {
                console.error('Paciente não encontrado');
                return;
            }

            // Enviar POST para criar consulta com data e hora separados
            const payload = {
                patient_id: selectedPatient.id,
                medic_id: selectedMedic.medic_id,
                scheduled_at: data.date,
                appointment_time: data.time,
            };

            console.debug('Admin criando consulta, payload:', payload);

            const res = await fetch('http://localhost:3000/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let bodyText: string | null = null;
                try {
                    bodyText = await res.text();
                } catch (e) {
                    /* ignore */
                }
                console.error('Erro ao criar consulta', res.status, bodyText);
                toast.error('Erro ao agendar consulta');
                return;
            }

            // Chamar callback local — ajustar specialty para enviar o nome, não o id, e garantir patientName correto
            const specialtyName = specialties.find(s => String(s.id) === data.specialty)?.name || data.specialty;
            onSubmit({ ...data, specialty: specialtyName, patientName: selectedPatient.name });
            toast.success('Consulta agendada com sucesso!');
            reset();
            onOpenChange(false);
        } catch (e) {
            console.error('Erro ao agendar consulta:', e);
            toast.error('Erro ao agendar consulta');
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-primary">
                        Agendar Consulta
                    </h2>

                    <p className="text-muted-foreground mt-1">
                        Agende uma consulta para um paciente
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(
                        handleFormSubmit
                    )}
                    className="space-y-4"
                >
                    {/* Paciente */}
                    <div className="space-y-2">
                        <Label>Nome do Paciente</Label>

                        <select
                            {...register("patientName", {
                                required:
                                    "Nome do paciente obrigatório",
                            })}
                            className={`w-full h-10 rounded-md border px-3 bg-input-background ${
                                errors.patientName
                                    ? "border-red-500"
                                    : "border-border"
                            }`}
                        >
                            <option value="">
                                Selecione um paciente
                            </option>
                            {patients.map((patient) => (
                                <option
                                    key={patient.id}
                                    value={String(patient.id)}
                                >
                                    {patient.name}
                                </option>
                            ))}
                        </select>

                        {errors.patientName && (
                            <p className="text-sm text-red-500">
                                {errors.patientName.message}
                            </p>
                        )}
                    </div>

                    {/* Data e Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Data</Label>

                            <Input
                                type="date"
                                min={minDate}
                                {...register("date", {
                                    required:
                                        "Data obrigatória",
                                    validate: (value) => {
                                        const selected =
                                            new Date(
                                                value
                                            );
                                        const today =
                                            new Date();
                                        today.setHours(
                                            0,
                                            0,
                                            0,
                                            0
                                        );
                                        return (
                                            selected >=
                                            today
                                        ) ||
                                            "Não é permitido selecionar datas retroativas";
                                    },
                                })}
                                className={
                                    errors.date
                                        ? "border-red-500"
                                        : ""
                                }
                            />

                            {errors.date && (
                                <p className="text-sm text-red-500">
                                    {
                                        errors.date
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Horário</Label>

                            <select
                                {...register(
                                    "time",
                                    {
                                        required:
                                            "Horário obrigatório",
                                    }
                                )}
                                className={`w-full h-10 rounded-md border px-3 bg-input-background ${
                                    errors.time
                                        ? "border-red-500"
                                        : "border-border"
                                }`}
                            >
                                <option value="">
                                    Selecione
                                </option>
                                {availableTimes.map(
                                    (time) => (
                                        <option
                                            key={time}
                                            value={time}
                                        >
                                            {time}
                                        </option>
                                    )
                                )}
                            </select>

                            {errors.time && (
                                <p className="text-sm text-red-500">
                                    {
                                        errors.time
                                            .message
                                    }
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Especialidade */}
                    <div className="space-y-2">
                        <Label>Especialidade</Label>

                        <select
                            {...register(
                                "specialty",
                                {
                                    required:
                                        "Especialidade obrigatória",
                                }
                            )}
                            className={`w-full h-10 rounded-md border px-3 bg-input-background ${
                                errors.specialty
                                    ? "border-red-500"
                                    : "border-border"
                            }`}
                        >
                            <option value="">
                                Selecione
                            </option>

                            {specialties.map(
                                (spec) => (
                                    <option
                                        key={spec.id}
                                        value={String(spec.id)}
                                    >
                                        {spec.name}
                                    </option>
                                )
                            )}
                        </select>

                        {errors.specialty && (
                            <p className="text-sm text-red-500">
                                {
                                    errors
                                        .specialty
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* Médico */}
                    <div className="space-y-2">
                        <Label>Médico</Label>

                        <select
                            {...register("medic", {
                                required:
                                    "Médico obrigatório",
                            })}
                            disabled={
                                !selectedSpecialtyId
                            }
                            className={`w-full h-10 rounded-md border px-3 bg-input-background disabled:opacity-50 disabled:cursor-not-allowed ${
                                errors.medic
                                    ? "border-red-500"
                                    : "border-border"
                            }`}
                        >
                            <option value="">
                                {selectedSpecialtyId
                                    ? "Selecione"
                                    : "Selecione uma especialidade primeiro"}
                            </option>

                            {filteredDoctors.map(
                                (doc) => (
                                    <option
                                        key={doc}
                                        value={doc}
                                    >
                                        {doc}
                                    </option>
                                )
                            )}
                        </select>

                        {errors.medic && (
                            <p className="text-sm text-red-500">
                                {
                                    errors.medic
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(false)
                            }
                        >
                            Cancelar
                        </Button>

                        <Button type="submit">
                            Agendar Consulta
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
