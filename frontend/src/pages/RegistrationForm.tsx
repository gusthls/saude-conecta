import { useForm } from "react-hook-form";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/Card";
import { toast } from "sonner";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import { useState } from "react";

interface RegistrationFormData {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    userType: string;
    password: string;
    confirmPassword: string;
}

interface RegistrationFormProps {
    onSwitchToLogin: () => void;
}

export function RegistrationForm({ onSwitchToLogin }: RegistrationFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegistrationFormData>();

    const password = watch("password");

    const onSubmit = async (data: RegistrationFormData) => {
        try {
            const response = await fetch("http://localhost:3000/api/patients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.fullName,
                    cpf: data.cpf,
                    email: data.email,
                    phone: data.phone,
                    password: data.password,
                    status: 1
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error("Erro no cadastro", {
                    description: errorData.message || "Algo deu errado"
                });
                return;
            }

            const result = await response.json();
            toast.success("Cadastro realizado com sucesso!", {
                description: `Bem-vindo(a), ${data.fullName}!`,
            });
            console.log(result);
        } catch (error) {
            console.error("Erro ao cadastrar paciente:", error);
            toast.error("Erro no cadastro", {
                description: "Não foi possível conectar ao servidor"
            });
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Stethoscope className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Cadastro Clínica</CardTitle>
                </div>
                <CardDescription>
                    Preencha os dados abaixo para criar sua conta na clínica
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nome completo */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Nome completo</Label>
                        <Input
                            id="fullName"
                            placeholder="João Silva"
                            {...register("fullName", {
                                required: "Nome completo é obrigatório",
                                minLength: {
                                    value: 3,
                                    message:
                                        "Nome deve ter pelo menos 3 caracteres",
                                },
                            })}
                            className={errors.fullName ? "border-red-500" : ""}
                        />
                        {errors.fullName && (
                            <p className="text-sm text-red-500">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="joao@exemplo.com"
                            {...register("email", {
                                required: "Email é obrigatório",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido",
                                },
                            })}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Telefone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            {...register("phone", {
                                required: "Telefone é obrigatório",
                                pattern: {
                                    value: /^[\d\s()+-]+$/,
                                    message: "Telefone inválido",
                                },
                            })}
                            className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    {/* CPF */}
                    <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                            id="cpf"
                            placeholder="000.000.000-00"
                            maxLength={14}
                            {...register("cpf", {
                                required: "CPF é obrigatório",
                                validate: (value) => {
                                    const cpfDigits = value.replace(/\D/g, "");
                                    if (cpfDigits.length !== 11) {
                                        return "CPF deve conter 11 dígitos";
                                    }
                                    // Validação básica: verifica se não são todos números iguais
                                    if (/^(\d)\1{10}$/.test(cpfDigits)) {
                                        return "CPF inválido";
                                    }
                                    return true;
                                },
                                onChange: (e) => {
                                    // Formata o CPF enquanto digita
                                    let value = e.target.value.replace(
                                        /\D/g,
                                        "",
                                    );
                                    if (value.length <= 11) {
                                        value = value.replace(
                                            /(\d{3})(\d)/,
                                            "$1.$2",
                                        );
                                        value = value.replace(
                                            /(\d{3})(\d)/,
                                            "$1.$2",
                                        );
                                        value = value.replace(
                                            /(\d{3})(\d{1,2})$/,
                                            "$1-$2",
                                        );
                                        e.target.value = value;
                                    }
                                },
                            })}
                            className={errors.cpf ? "border-red-500" : ""}
                        />
                        {errors.cpf && (
                            <p className="text-sm text-red-500">
                                {errors.cpf.message}
                            </p>
                        )}
                    </div>
  
                    {/* Senha */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Senha é obrigatória",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Senha deve ter pelo menos 8 caracteres",
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message:
                                            "Senha deve conter letras maiúsculas, minúsculas e números",
                                    },
                                })}
                                className={
                                    errors.password
                                        ? "border-red-500 pr-10"
                                        : "pr-10"
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirmar senha */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar senha</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("confirmPassword", {
                                    required:
                                        "Confirmação de senha é obrigatória",
                                    validate: (value) =>
                                        value === password ||
                                        "As senhas não coincidem",
                                })}
                                className={
                                    errors.confirmPassword
                                        ? "border-red-500 pr-10"
                                        : "pr-10"
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Botão de submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Cadastrando..." : "Criar conta"}
                    </Button>

                    {/* Link para login */}
                    <p className="text-center text-sm text-gray-600">
                        Já tem uma conta?{" "}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-primary hover:underline"
                        >
                            Faça login
                        </button>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
