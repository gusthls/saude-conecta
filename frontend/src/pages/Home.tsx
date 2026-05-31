import logoSaude from "../assets/logo-saude-conecta.png";

interface HomeProps {
  onNavigateToLogin: () => void;
}

export function Home({ onNavigateToLogin }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] flex flex-col items-center font-sans">

      {/* NAVBAR */}
      <nav className="w-full px-[10%] py-4 bg-white flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full p-1 w-11 h-11 flex items-center justify-center shadow-sm border border-slate-100">
            <img
              src={logoSaude}
              alt="Logo Saúde Conecta"
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <span className="font-extrabold text-[#1f6aa5] text-xl tracking-tight">
            Saúde Conecta
          </span>
        </div>

        <button
          className="bg-[#00a896] hover:bg-[#1f6aa5] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(0,168,150,0.3)] transition-all duration-300 hover:-translate-y-0.5"
          onClick={onNavigateToLogin}
        >
          Acessar Sistema
        </button>
      </nav>

      {/* HERO */}
      <header className="w-full text-center bg-white px-6 py-20 border-b border-slate-200 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black text-[#1f6aa5] max-w-3xl leading-tight mb-6">
          Seu bem-estar a um clique de distância
        </h1>

        <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed mb-8">
          Agende suas consultas, gerencie seus horários e conecte-se com os
          melhores profissionais de saúde em uma única plataforma prática,
          moderna e segura.
        </p>

        <button
          className="bg-[#00a896] hover:bg-[#1f6aa5] text-white px-9 py-4 rounded-xl font-bold text-base shadow-[0_10px_20px_rgba(0,168,150,0.3)] hover:shadow-[0_15px_25px_rgba(31,106,165,0.3)] transition-all duration-300 hover:-translate-y-1"
          onClick={onNavigateToLogin}
        >
          Agendar Minha Consulta
        </button>
      </header>

      {/* SOBRE NÓS */}
      <section className="w-full bg-slate-50 py-20 px-[10%]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1f6aa5] mb-6">
            Sobre a Saúde Conecta
          </h2>

          <p className="text-slate-600 max-w-4xl mx-auto leading-relaxed text-lg">
            A Saúde Conecta nasceu com a missão de aproximar pacientes e
            profissionais através da tecnologia. Nossa clínica oferece um
            ambiente acolhedor, equipamentos modernos e atendimento humanizado,
            garantindo uma experiência de cuidado completa para toda a família.
          </p>
        </div>
      </section>

      {/* INDICADORES */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-6xl mx-auto px-[10%]">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-black text-[#00a896]">15+</h3>
              <p className="text-slate-500 mt-2">Especialidades</p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-[#00a896]">50+</h3>
              <p className="text-slate-500 mt-2">Médicos</p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-[#00a896]">20 mil+</h3>
              <p className="text-slate-500 mt-2">Pacientes Atendidos</p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-[#00a896]">98%</h3>
              <p className="text-slate-500 mt-2">Satisfação</p>
            </div>
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section className="w-full max-w-6xl px-[10%] py-20">
        <h2 className="text-center text-3xl font-bold text-[#1f6aa5] mb-12">
          Nossas Especialidades
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          <div
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4">🫀</span>
            <h3 className="font-bold text-lg">Cardiologia</h3>
          </div>

          <div
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4">🩺</span>
            <h3 className="font-bold text-lg">Clínica Geral</h3>
          </div>

          <div
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4">🧠</span>
            <h3 className="font-bold text-lg">Neurologia</h3>
          </div>

          <div
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4">👶</span>
            <h3 className="font-bold text-lg">Pediatria</h3>
          </div>

          <div
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4">👁️</span>
            <h3 className="font-bold text-lg">Oftalmologia</h3>
          </div>

          <div
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4">🦴</span>
            <h3 className="font-bold text-lg">Ortopedia</h3>
          </div>

          <div
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4">🧑‍⚕️</span>
            <h3 className="font-bold text-lg">Dermatologia</h3>
          </div>

          <div
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4">💙</span>
            <h3 className="font-bold text-lg">Psiquiatria</h3>
          </div>

        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="w-full bg-slate-50 py-20 px-[10%]">
        <h2 className="text-center text-3xl font-bold text-[#1f6aa5] mb-12">
          Por que escolher a Saúde Conecta?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold text-xl mb-4">📅 Agendamento Online</h3>
            <p className="text-slate-500">
              Marque consultas rapidamente sem filas e sem burocracia.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold text-xl mb-4">🔒 Segurança Total</h3>
            <p className="text-slate-500">
              Dados protegidos conforme as exigências da LGPD.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold text-xl mb-4">🏥 Estrutura Moderna</h3>
            <p className="text-slate-500">
              Consultórios equipados com tecnologia de última geração.
            </p>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="w-full py-20 bg-white px-[10%]">
        <h2 className="text-center text-3xl font-bold text-[#1f6aa5] mb-12">
          Como Funciona
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
          <div>
            <div className="text-5xl mb-4">1️⃣</div>
            <h3 className="font-bold mb-2">Escolha a Especialidade</h3>
            <p className="text-slate-500">
              Selecione a área médica desejada.
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">2️⃣</div>
            <h3 className="font-bold mb-2">Agende um Horário</h3>
            <p className="text-slate-500">
              Escolha a melhor data para você.
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">3️⃣</div>
            <h3 className="font-bold mb-2">Receba Atendimento</h3>
            <p className="text-slate-500">
              Compareça à clínica e seja atendido.
            </p>
          </div>
        </div>
      </section>

      {/* CONVÊNIOS */}
      <section className="w-full bg-slate-50 py-20 px-[10%]">
        <h2 className="text-center text-3xl font-bold text-[#1f6aa5] mb-12">
          Convênios Aceitos
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {[
            "Unimed",
            "Bradesco Saúde",
            "SulAmérica",
            "Amil",
            "NotreDame",
            "Porto Saúde",
          ].map((item) => (
            <span
              key={item}
              className="bg-white px-6 py-4 rounded-xl shadow"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="w-full py-20 bg-white px-[10%]">
        <h2 className="text-center text-3xl font-bold text-[#1f6aa5] mb-12">
          O que nossos pacientes dizem
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-slate-50 p-8 rounded-2xl">
            <p className="italic">
              "Atendimento excelente e muito rápido."
            </p>
            <h4 className="font-bold mt-4">Maria Oliveira</h4>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl">
            <p className="italic">
              "Sistema simples e médicos extremamente atenciosos."
            </p>
            <h4 className="font-bold mt-4">Carlos Santos</h4>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl">
            <p className="italic">
              "A melhor experiência que já tive em uma clínica."
            </p>
            <h4 className="font-bold mt-4">Fernanda Costa</h4>
          </div>
        </div>
      </section>

      {/* PARCEIROS */}
      <section className="w-full py-20 bg-slate-50">
        <h2 className="text-center text-3xl font-bold text-[#1f6aa5] mb-12">
          Instituições Parceiras
        </h2>

        <div className="flex flex-wrap justify-center gap-8 text-xl font-semibold text-slate-500">
          <span>Hospital Vida+</span>
          <span>Laboratório Prime</span>
          <span>Instituto Bem Estar</span>
          <span>Centro Médico São Lucas</span>
          <span>Clínica Prevent Care</span>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[#1f6aa5] text-white py-20 text-center">
        <h2 className="text-4xl font-black mb-4">
          Cuide da sua saúde hoje mesmo
        </h2>

        <p className="mb-8 text-lg opacity-90">
          Agende sua consulta em poucos minutos.
        </p>

        <button
          onClick={onNavigateToLogin}
          className="bg-[#00a896] px-8 py-4 rounded-xl font-bold hover:scale-105 transition"
        >
          Agendar Agora
        </button>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-slate-900 text-white py-12 px-[10%]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

          <div>
            <h3 className="font-bold text-xl mb-4">Saúde Conecta</h3>
            <p className="text-slate-400">
              Tecnologia e saúde conectando pessoas ao cuidado que elas merecem.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Consultas</li>
              <li>Exames</li>
              <li>Check-up</li>
              <li>Retornos</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-slate-400">
              <li>(11) 4000-2026</li>
              <li>contato@saudeconecta.com.br</li>
              <li>São Paulo - SP</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Horário</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Seg a Sex: 07h às 20h</li>
              <li>Sábado: 08h às 14h</li>
              <li>Domingo: Fechado</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500">
          © 2026 Saúde Conecta. Todos os direitos reservados.
        </div>
      </footer>

    </div>
  );
}