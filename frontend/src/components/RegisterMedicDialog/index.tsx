import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";

interface RegisterMedicFormData {
    name: string;
    specialty: string;
    email: string;
    phone: string;
    crm: string;
}

interface RegisterMedicDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: RegisterMedicFormData) => void;
}
import { useEffect, useState } from "react";

const DEFAULT_SPECIALTIES: string[] = [];

export function RegisterMedicDialog({
    open,
    onOpenChange,
    onSubmit,
}: RegisterMedicDialogProps) {
    const [specialties, setSpecialties] = useState<string[]>(DEFAULT_SPECIALTIES);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch('http://localhost:3000/api/medics');
                if (!res.ok) return;
                const data = await res.json();
                if (!mounted) return;
                const rawSpecs = data.map((m: any) => m.specialty).filter(Boolean);
                const specs = Array.from(new Set(rawSpecs)).map(String);
                setSpecialties(specs as string[]);
            } catch (e) {
                console.warn('Erro ao carregar especialidades:', e);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegisterMedicFormData>();

    const handleFormSubmit = (
        data: RegisterMedicFormData
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
                        Cadastrar Novo Médico
                    </h2>

                    <p className="text-muted-foreground mt-1">
                        Preencha os dados para
                        registrar um novo médico
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(
                        handleFormSubmit
                    )}
                    className="space-y-4"
                >
                    {/* Nome */}
                    <div className="space-y-2">
                        <Label>Nome Completo</Label>

                        <Input
                            placeholder="Dr. João Silva"
                            {...register("name", {
                                required:
                                    "Nome obrigatório",
                                minLength: {
                                    value: 3,
                                    message:
                                        "Nome deve ter no mínimo 3 caracteres",
                                },
                            })}
                            className={
                                errors.name
                                    ? "border-red-500"
                                    : ""
                            }
                        />

                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {
                                    errors.name
                                        .message
                                }
                            </p>
                        )}
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

                    {/* Email */}
                    <div className="space-y-2">
                        <Label>Email</Label>

                        <Input
                            type="email"
                            placeholder="medico@example.com"
                            {...register("email", {
                                required:
                                    "Email obrigatório",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message:
                                        "Email inválido",
                                },
                            })}
                            className={
                                errors.email
                                    ? "border-red-500"
                                    : ""
                            }
                        />

                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {
                                    errors.email
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* Telefone */}
                    <div className="space-y-2">
                        <Label>Telefone</Label>

                        <Input
                            placeholder="(11) 99999-9999"
                            {...register(
                                "phone",
                                {
                                    required:
                                        "Telefone obrigatório",
                                }
                            )}
                            className={
                                errors.phone
                                    ? "border-red-500"
                                    : ""
                            }
                        />

                        {errors.phone && (
                            <p className="text-sm text-red-500">
                                {
                                    errors.phone
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* CRM */}
                    <div className="space-y-2">
                        <Label>
                            CRM (Registro de Médico)
                        </Label>

                        <Input
                            placeholder="123456"
                            {...register("crm", {
                                required:
                                    "CRM obrigatório",
                            })}
                            className={
                                errors.crm
                                    ? "border-red-500"
                                    : ""
                            }
                        />

                        {errors.crm && (
                            <p className="text-sm text-red-500">
                                {errors.crm.message}
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
                            Cadastrar Médico
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
