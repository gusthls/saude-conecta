import { useState } from "react";
import { AuthPage } from "./pages/AuthPage";
import { LoginForm } from "./pages/LoginForm";
import { RegistrationForm } from "./pages/RegistrationForm";

function App() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="size-full">
            <AuthPage
                title={isLogin ? "Olá, bem-vindo" : "Junte-se a nós"}
                description={
                    isLogin
                        ? "Entre na sua conta para acessar nosso serviço"
                        : "Cadastre a sua conta para acessar nosso serviço"
                }
            >
                {isLogin ? (
                    <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                ) : (
                    <RegistrationForm
                        onSwitchToLogin={() => setIsLogin(true)}
                    />
                )}
            </AuthPage>
        </div>
    );
}

export default App;
