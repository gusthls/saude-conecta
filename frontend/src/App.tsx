import { useState } from "react";

import { AuthPage } from "./pages/AuthPage";
import { LoginForm } from "./pages/LoginForm";
import { RegistrationForm } from "./pages/RegistrationForm";
import { ForgotPasswordForm } from "./pages/ForgotPasswordForm";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";

import { Toaster } from "./components/Sonner";

// O tipo aceita todas as telas do seu ecossistema
type ViewType =
    | "home"
    | "login"
    | "register"
    | "forgot-password";

function App() {
    // controla se está logado
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // pagina inicial home
    const [currentView, setCurrentView] = useState<ViewType>("home");

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
        // Quando o usuário desloga, ele volta lá para a página inicial
        setCurrentView("home");
    }

    // 1. SE ESTIVER LOGADO: Mostra o Dashboard de forma prioritária
    if (isLoggedIn) {
        return (
            <>
                <Dashboard onLogout={handleLogout} />
                <Toaster />
            </>
        );
    }

    // 2. SE NÃO ESTIVER LOGADO: Roda todo o resto do código junto
    return (
        <div className="size-full">
            
            {/* TELA 1: Se a visualização for "home", roda a Home aqui dentro */}
            {currentView === "home" && (
                <Home onNavigateToLogin={() => setCurrentView("login")} />
            )}

            {/* TELAS 2, 3 e 4: Se for qualquer outra rota de autenticação, roda o AuthPage */}
            {currentView !== "home" && (
                <AuthPage
                    title={title}
                    description={description}
                >
                    {currentView === "login" && (
                        <LoginForm
                            onSwitchToRegister={() => setCurrentView("register")}
                            onSwitchToForgotPassword={() => setCurrentView("forgot-password")}
                            onLogin={handleLogin}
                        />
                    )}

                    {currentView === "register" && (
                        <RegistrationForm
                            onSwitchToLogin={() => setCurrentView("login")}
                        />
                    )}

                    {currentView === "forgot-password" && (
                        <ForgotPasswordForm
                            onBackToLogin={() => setCurrentView("login")}
                        />
                    )}
                </AuthPage>
            )}

            {/* O Toaster agora assiste e roda junto com absolutamente qualquer tela deslogada */}
            <Toaster />
        </div>
    );
}

export default App;