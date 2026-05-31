import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";

interface RegisterMedicFormData {
    name: string;
    specialty_id: string;
    email: string;
    phone: string;
    cpf: string;
    crm: string;
}

interface RegisterMedicDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: RegisterMedicFormData) => void;
}
import { useEffect, useState } from "react";

type Specialty = { id: number; name: string };

const DEFAULT_SPECIALTIES: Specialty[] = [];

export function RegisterMedicDialog({
    open,
    onOpenChange,
    onSubmit,
}: RegisterMedicDialogProps) {
    const [specialties, setSpecialties] = useState<Specialty[]>(DEFAULT_SPECIALTIES);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch('http://localhost:3000/api/specialties');
                if (!res.ok) return;
                const data = await res.json();
                if (!mounted) return;
                const specs = (data as any[])
                    .map((spec) => ({ id: spec.id, name: String(spec.name) }))
                    .filter((spec) => spec.name);
                setSpecialties(specs);
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
                                "specialty_id",
                                {
                                    required:
                                        "Especialidade obrigatória",
                                }
                            )}
                            className={`w-full h-10 rounded-md border px-3 bg-input-background ${
                                errors.specialty_id
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

                        {errors.specialty_id && (
                            <p className="text-sm text-red-500">
                                {
                                    errors
                                        .specialty_id
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* CPF */}
                    <div className="space-y-2">
                        <Label>CPF</Label>

                        <Input
                            placeholder="000.000.000-00"
                            {...register("cpf", {
                                required:
                                    "CPF obrigatório",
                                pattern: {
                                    value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                                    message:
                                        "Cpf inválido",
                                },
                            })}
                            className={
                                errors.cpf
                                    ? "border-red-500"
                                    : ""
                            }
                        />

                        {errors.cpf && (
                            <p className="text-sm text-red-500">
                                {errors.cpf.message}
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
