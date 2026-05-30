import { useState, useEffect } from "react";
import type { UserType } from "./types/appointments";

import { AuthPage } from "./pages/AuthPage";
import { LoginForm } from "./pages/LoginForm";
import { RegistrationForm } from "./pages/RegistrationForm";
import { ForgotPasswordForm } from "./pages/ForgotPasswordForm";
import { Dashboard } from "./pages/Dashboard";

import { Toaster } from "./components/Sonner";

type ViewType =
    | "login"
    | "register"
    | "forgot-password";

function App() {
    // controla se está logado
    const [isLoggedIn, setIsLoggedIn] =
        useState(false);

    const [userType, setUserType] = useState<UserType | null>(null);

    // controla qual tela auth aparece
    const [currentView, setCurrentView] =
        useState<ViewType>("login");

    const title =
        currentView === "login"
            ? "Olá, bem-vindo"
            : currentView === "register"
            ? "Junte-se a nós"
            : "Recuperar senha";

    const description =
        currentView === "login"
            ? "Entre na sua conta para acessar nosso serviço"
            : currentView === "register"
            ? "Cadastre sua conta para acessar nosso serviço"
            : "Digite seu email para recuperar sua senha";

    // login
    function handleLogin(type?: UserType) {
        setIsLoggedIn(true);
        if (type) setUserType(type);
    }

    // logout
        function handleLogout() {
                setIsLoggedIn(false);
                setUserType(null);

                // remove sessão
                try {
                    localStorage.removeItem('session');
                } catch (e) {
                    console.warn('Erro ao limpar sessão', e);
                }

                // volta pro login
                setCurrentView("login");
        }

        // restaura sessão ao carregar a aplicação
        useEffect(() => {
            try {
                const raw = localStorage.getItem('session');
                if (!raw) return;

                const session = JSON.parse(raw);
                if (session && session.expires && session.expires > Date.now()) {
                    setIsLoggedIn(true);
                    setUserType(session.userType as UserType);
                } else {
                    localStorage.removeItem('session');
                }
            } catch (e) {
                console.warn('Erro ao restaurar sessão:', e);
            }
        }, []);

    // se estiver logado mostra dashboard
    if (isLoggedIn) {
        return (
            <>
                <Dashboard
                    onLogout={handleLogout}
                    userType={userType ?? "patient"}
                />

                <Toaster />
            </>
        );
    }

    // senão mostra auth
    return (
        <div className="size-full">
            <AuthPage
                title={title}
                description={description}
            >
                {currentView === "login" && (
                        <LoginForm
                        onSwitchToRegister={() =>
                            setCurrentView(
                                "register"
                            )
                        }
                        onSwitchToForgotPassword={() =>
                            setCurrentView(
                                "forgot-password"
                            )
                        }
                        onLogin={(type) => handleLogin(type)}
                    />
                )}

                {currentView === "register" && (
                    <RegistrationForm
                        onSwitchToLogin={() =>
                            setCurrentView("login")
                        }
                    />
                )}

                {currentView ===
                    "forgot-password" && (
                    <ForgotPasswordForm
                        onBackToLogin={() =>
                            setCurrentView("login")
                        }
                    />
                )}
            </AuthPage>
            <Toaster />
        </div>
    );
}

export default App;