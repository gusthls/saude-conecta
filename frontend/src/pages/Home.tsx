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

      {/* HERO SECTION */}
      <header className="w-full text-center bg-white px-6 py-20 border-b border-slate-200 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black text-[#1f6aa5] max-w-3xl leading-tight mb-6">
          Seu bem-estar a um clique de distância
        </h1>
        <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed mb-8">
          Agende suas consultas, gerencie seus horários e conecte-se com os melhores profissionais de saúde em uma única plataforma prática, moderna e segura.
        </p>
        <button 
          className="bg-[#00a896] hover:bg-[#1f6aa5] text-white px-9 py-4 rounded-xl font-bold text-base shadow-[0_10px_20px_rgba(0,168,150,0.3)] hover:shadow-[0_15px_25px_rgba(31,106,165,0.3)] transition-all duration-300 hover:-translate-y-1"
          onClick={onNavigateToLogin}
        >
          Agendar Minha Consulta
        </button>
      </header>

      {/* SPECIALTIES SECTION */}
      <section className="w-full max-w-6xl px-[10%] py-20">
        <h2 className="text-center text-3xl font-bold text-[#1f6aa5] mb-12">
          Nossas Especialidades
        </h2>
        
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div 
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4 transition-transform duration-300 group-hover:scale-110">🫀</span>
            <h3 className="font-bold text-slate-700 text-lg group-hover:text-[#1f6aa5] transition-colors">Cardiologia</h3>
          </div>

          {/* Card 2 */}
          <div 
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4 transition-transform duration-300 group-hover:scale-110">🩺</span>
            <h3 className="font-bold text-slate-700 text-lg group-hover:text-[#1f6aa5] transition-colors">Clínica Geral</h3>
          </div>

          {/* Card 3 */}
          <div 
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4 transition-transform duration-300 group-hover:scale-110">🧠</span>
            <h3 className="font-bold text-slate-700 text-lg group-hover:text-[#1f6aa5] transition-colors">Neurologia</h3>
          </div>

          {/* Card 4 */}
          <div 
            onClick={onNavigateToLogin}
            className="bg-white p-8 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00a896] transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <span className="text-5xl block mb-4 transition-transform duration-300 group-hover:scale-110">👶</span>
            <h3 className="font-bold text-slate-700 text-lg group-hover:text-[#1f6aa5] transition-colors">Pediatria</h3>
          </div>

        </div>
      </section>
    </div>
  );
}