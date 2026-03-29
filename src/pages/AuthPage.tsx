import logoSaude from "../assets/logo-saude-conecta.png";
interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function AuthPage({
    children,
    title = "Olá, bem-vindo",
    description = "Entre na sua conta para acessar nosso serviço",
}: AuthLayoutProps) {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Left side */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-[#1f6aa5] to-[#1b5c91] p-12 flex-col justify-between relative overflow-hidden">
                {/* Bolhas decorativas */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                {/* Logo */}
                <div className="relative z-10">
                    <div className="bg-white rounded-full p-2 w-32 h-32 flex items-center justify-center shadow-xl">
                        <img
                            src={logoSaude}
                            alt="Saúde Conecta"
                            className="w-full h-full object-contain rounded-full"
                        />
                    </div>
                </div>

                {/* Texto */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold text-white leading-tight">
                            {title}
                        </h1>
                        <p className="text-lg text-blue-100 max-w-md">
                            {description}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-16 pt-6">
                        <div>
                            <div className="text-3xl font-bold text-white">
                                500+
                            </div>
                            <div className="text-sm text-blue-100">
                                Pacientes atendidos
                            </div>
                        </div>

                        <div>
                            <div className="text-3xl font-bold text-white">
                                50+
                            </div>
                            <div className="text-sm text-blue-100">
                                Profissionais qualificados
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-xs text-blue-100/70">
                    © 2026 Clínica Saúde+. Todos os direitos reservados.
                </div>
            </div>

            {/* Right side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f3f6fb]">
                {children}
            </div>
        </div>
    );
}
