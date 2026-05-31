import { useState } from "react";
import { toast } from "sonner";

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
}

type StepType = "email" | "token" | "newPassword" | "error";

export function ForgotPasswordForm({
    onBackToLogin,
}: ForgotPasswordFormProps) {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<StepType>("email");

    function validateEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    async function handleEmailSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Email é obrigatório");
            return;
        }

        if (!validateEmail(email)) {
            setError("Digite um email válido");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setStep("token");
                setError("");
            } else {
                setError("Email não encontrado");
                setStep("error");
            }
        } catch (err) {
            setError("Erro ao enviar email");
            setStep("error");
        } finally {
            setLoading(false);
        }
    }

    async function handleTokenSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Token é obrigatório");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/verify-reset-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token }),
            });

            if (response.ok) {
                setStep("newPassword");
                setError("");
            } else {
                const data = await response.json();
                setError(data.message || "Token inválido");
            }
        } catch (err) {
            setError("Erro ao verificar token");
        } finally {
            setLoading(false);
        }
    }

    async function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!newPassword) {
            setError("Nova senha é obrigatória");
            return;
        }

        if (newPassword.length < 6) {
            setError("Senha deve ter no mínimo 6 caracteres");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("As senhas não correspondem");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword }),
            });

            if (response.ok) {
                setError("");
                toast.success('Senha atualizada com sucesso!');
                // Sucesso - voltar para login após 2 segundos
                setTimeout(() => {
                    onBackToLogin();
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.message || "Erro ao atualizar senha");
                toast.error(data.message || 'Erro ao atualizar senha');
            }
        } catch (err) {
            setError("Erro ao atualizar senha");
            toast.error('Erro ao atualizar senha');
        } finally {
            setLoading(false);
        }
    }

    // PASSO 1: Email
    if (step === "email") {
        return (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-primary mb-2">
                    Esqueci minha senha
                </h2>

                <p className="text-muted-foreground mb-6">
                    Digite seu email para recuperar sua senha
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium">Email</label>

                        <input
                            type="email"
                            placeholder="seuemail@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full border rounded-lg px-4 py-3 bg-input-background outline-none focus:ring-2 focus:ring-primary ${
                                error ? "border-red-500" : "border-border"
                            }`}
                        />

                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            Você receberá um email com instruções para redefinir sua senha.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? "Enviando..." : "Enviar link de recuperação"}
                    </button>

                    <button
                        type="button"
                        onClick={onBackToLogin}
                        className="w-full text-primary py-2 hover:underline"
                    >
                        Voltar para login
                    </button>
                </form>
            </div>
        );
    }

    // PASSO 2: Token (Modal)
    if (step === "token") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                    <h2 className="text-2xl font-semibold text-primary mb-4">
                        Verificar Token
                    </h2>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-green-800 font-medium">
                            Enviamos um link para:
                        </p>
                        <p className="text-green-700 font-semibold mt-2">{email}</p>
                        <p className="text-sm text-green-700 mt-3">
                            Verifique sua caixa de entrada e a pasta spam.
                        </p>
                    </div>

                    <form onSubmit={handleTokenSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2 font-medium">Digite o token recebido</label>

                            <input
                                type="text"
                                placeholder="000000"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                maxLength={6}
                                className={`w-full border rounded-lg px-4 py-3 bg-input-background text-center text-2xl tracking-widest outline-none focus:ring-2 focus:ring-primary ${
                                    error ? "border-red-500" : "border-border"
                                }`}
                            />

                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? "Verificando..." : "Verificar Token"}
                        </button>

                        <button
                            type="button"
                            onClick={onBackToLogin}
                            className="w-full text-primary py-2 hover:underline"
                        >
                            Voltar para login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // PASSO 3: Nova Senha (Modal)
    if (step === "newPassword") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                    <h2 className="text-2xl font-semibold text-primary mb-6">
                        Redefinir Senha
                    </h2>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2 font-medium">Digite a nova senha</label>

                            <input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={`w-full border rounded-lg px-4 py-3 bg-input-background outline-none focus:ring-2 focus:ring-primary ${
                                    error ? "border-red-500" : "border-border"
                                }`}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Confirme a senha</label>

                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full border rounded-lg px-4 py-3 bg-input-background outline-none focus:ring-2 focus:ring-primary ${
                                    error ? "border-red-500" : "border-border"
                                }`}
                            />

                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? "Atualizando..." : "Atualizar Senha"}
                        </button>

                        <button
                            type="button"
                            onClick={onBackToLogin}
                            className="w-full text-primary py-2 hover:underline"
                        >
                            Voltar para login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ERRO
    if (step === "error") {
        return (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">
                    Erro
                </h2>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>

                <button
                    onClick={() => {
                        setStep("email");
                        setError("");
                        setEmail("");
                        setToken("");
                        setNewPassword("");
                        setConfirmPassword("");
                    }}
                    className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition"
                >
                    Tentar novamente
                </button>

                <button
                    onClick={onBackToLogin}
                    className="w-full text-primary py-2 mt-4 hover:underline"
                >
                    Voltar para login
                </button>
            </div>
        );
    }

    return null;
}