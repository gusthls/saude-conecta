import { useState } from "react";

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
    function handleLogin() {
        setIsLoggedIn(true);
    }

    // logout
    function handleLogout() {
        setIsLoggedIn(false);

        // volta pro login
        setCurrentView("login");
    }

    // se estiver logado mostra dashboard
    if (isLoggedIn) {
        return (
            <>
                <Dashboard
                    onLogout={handleLogout}
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
                        onLogin={handleLogin}
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