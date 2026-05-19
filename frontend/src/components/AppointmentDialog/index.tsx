import { useForm } from "react-hook-form";

import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";

export interface AppointmentFormData {
    patientName: string;
    date: string;
    time: string;
    specialty: string;
    doctor: string;
}

interface AppointmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AppointmentFormData) => void;
}

const specialties = [
    "Cardiologia",
    "Dermatologia",
    "Ortopedia",
    "Pediatria",
    "Clínico Geral",
];

const doctors = [
    "Dr. João Silva",
    "Dra. Maria Santos",
    "Dr. Pedro Costa",
    "Dra. Ana Oliveira",
];

export function AppointmentDialog({
    open,
    onOpenChange,
    onSubmit,
}: AppointmentDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AppointmentFormData>();

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
                    {/* Paciente */}
                    <div className="space-y-2">
                        <Label>Nome do Paciente</Label>

                        <Input
                            placeholder="Nome completo"
                            {...register(
                                "patientName",
                                {
                                    required:
                                        "Nome obrigatório",
                                }
                            )}
                            className={
                                errors.patientName
                                    ? "border-red-500"
                                    : ""
                            }
                        />

                        {errors.patientName && (
                            <p className="text-sm text-red-500">
                                {
                                    errors
                                        .patientName
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* Data e Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Data</Label>

                            <Input
                                type="date"
                                {...register("date", {
                                    required:
                                        "Data obrigatória",
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

                            <Input
                                type="time"
                                {...register("time", {
                                    required:
                                        "Horário obrigatório",
                                })}
                                className={
                                    errors.time
                                        ? "border-red-500"
                                        : ""
                                }
                            />

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
                            {...register("doctor", {
                                required:
                                    "Médico obrigatório",
                            })}
                            className={`w-full h-10 rounded-md border px-3 bg-input-background ${
                                errors.doctor
                                    ? "border-red-500"
                                    : "border-border"
                            }`}
                        >
                            <option value="">
                                Selecione
                            </option>

                            {doctors.map((doc) => (
                                <option
                                    key={doc}
                                    value={doc}
                                >
                                    {doc}
                                </option>
                            ))}
                        </select>

                        {errors.doctor && (
                            <p className="text-sm text-red-500">
                                {
                                    errors.doctor
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* Observações */}
                    <div className="space-y-2">
                        <Label>
                            Observações
                        </Label>
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