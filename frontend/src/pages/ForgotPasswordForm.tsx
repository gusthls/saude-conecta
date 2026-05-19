import { useState } from "react";

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
}

type StatusType = "idle" | "success" | "error";

export function ForgotPasswordForm({
    onBackToLogin,
}: ForgotPasswordFormProps) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // controle da tela
    const [status, setStatus] = useState<StatusType>("idle");

    function validateEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");

        // validações
        if (!email) {
            setError("Email é obrigatório");
            return;
        }

        if (!validateEmail(email)) {
            setError("Digite um email válido");
            return;
        }

        setLoading(true);

        // Simulação API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulação de resposta da API
        const success = true;

        setLoading(false);

        if (success) {
            setStatus("success");
        } else {
            setStatus("error");
        }
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-primary mb-2">
                Esqueci minha senha
            </h2>

            <p className="text-muted-foreground mb-6">
                Digite seu email para recuperar sua senha
            </p>

            {/* SUCESSO */}
            {status === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 font-medium">
                        Enviamos um link para:
                    </p>

                    <p className="text-green-700 mt-2">{email}</p>

                    <p className="text-sm text-green-700 mt-2">
                        Verifique sua caixa de entrada e a pasta spam.
                    </p>
                </div>
            )}

            {/* ERRO API */}
            {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700 font-medium">
                        Não foi possível enviar o link de recuperação.
                    </p>

                    <p className="text-sm text-red-600 mt-2">
                        Tente novamente em alguns minutos.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Email</label>

                    <input
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-3 bg-input-background outline-none focus:ring-2 focus:ring-primary ${
                            error
                                ? "border-red-500"
                                : "border-border"
                        }`}
                    />

                    {/* ERRO VALIDAÇÃO */}
                    {error && (
                        <p className="text-red-500 text-sm mt-2">
                            {error}
                        </p>
                    )}
                </div>

                {/* INFO */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                        Você receberá um email com instruções para redefinir sua
                        senha.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                    {loading
                        ? "Enviando..."
                        : "Enviar link de recuperação"}
                </button>

                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="w-full text-primary py-2"
                >
                    Voltar para login
                </button>
            </form>
        </div>
    );
}