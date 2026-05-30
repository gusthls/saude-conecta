import { useForm } from "react-hook-form";
import { useMemo, useEffect, useState } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";

export interface AppointmentFormData {
    date: string;
    time: string;
    specialty: string;
    medic: string;
}

interface AppointmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AppointmentFormData) => void;
}

type Medic = { medic_id: number | string; name: string; specialty?: string };

// medics will be loaded from API

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

export function AppointmentDialog({
    open,
    onOpenChange,
    onSubmit,
}: AppointmentDialogProps) {
    const [medics, setMedics] = useState<Medic[]>([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch('http://localhost:3000/api/medics');
                if (!res.ok) return;
                const data = await res.json();
                if (!mounted) return;
                setMedics(
                    data.map((m: any) => ({
                        medic_id: m.medic_id ?? m.id,
                        name: m.name,
                        specialty: m.specialty,
                    }))
                );
            } catch (e) {
                console.warn('Erro ao buscar médicos:', e);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const medicsBySpecialty = useMemo(() => {
        const map: Record<string, string[]> = {};
        medics.forEach((m) => {
            const spec = m.specialty || 'Outros';
            if (!map[spec]) map[spec] = [];
            if (m.name) map[spec].push(m.name);
        });
        return map;
    }, [medics]);

    const specialties = useMemo(() => Object.keys(medicsBySpecialty), [medicsBySpecialty]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<AppointmentFormData>();

    const selectedSpecialty =
        watch("specialty");

    const availableTimes = useMemo(
        () => generateAvailableTimes(),
        []
    );

    const filteredDoctors = useMemo(() => {
        if (!selectedSpecialty) {
            return [];
        }
        return (
            medicsBySpecialty[
                selectedSpecialty
            ] || []
        );
    }, [selectedSpecialty]);

    // Obter a data mínima (hoje)
    const today = new Date();
    const minDate = today
        .toISOString()
        .split("T")[0];

    const handleFormSubmit = (
        data: AppointmentFormData
    ) => {
        onSubmit(data);
        reset();
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-primary">
                        Agendar Nova Consulta
                    </h2>

                    <p className="text-muted-foreground mt-1">
                        Preencha os dados para agendar
                        uma consulta
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(
                        handleFormSubmit
                    )}
                    className="space-y-4"
                >
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
                                        key={spec}
                                        value={spec}
                                    >
                                        {spec}
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
                                !selectedSpecialty
                            }
                            className={`w-full h-10 rounded-md border px-3 bg-input-background disabled:opacity-50 disabled:cursor-not-allowed ${
                                errors.medic
                                    ? "border-red-500"
                                    : "border-border"
                            }`}
                        >
                            <option value="">
                                {selectedSpecialty
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