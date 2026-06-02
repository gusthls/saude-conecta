# 🏥 Saúde Conecta

Aplicação web fullstack voltada para a área da saúde, conectando usuários a serviços e informações médicas de forma prática e centralizada.

---

## 📋 Sobre o projeto

O **Saúde Conecta** é uma plataforma que tem como objetivo facilitar o acesso e o gerenciamento de dados e serviços de saúde. A aplicação conta com uma interface moderna no frontend e uma API robusta no backend integrada a um banco de dados SQL Server.

---

## 🚀 Tecnologias utilizadas

### Frontend
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [mssql](https://www.npmjs.com/package/mssql) — driver para Microsoft SQL Server

### Ferramentas
- [Concurrently](https://www.npmjs.com/package/concurrently) — execução simultânea de frontend e backend
- [ts-node-dev](https://www.npmjs.com/package/ts-node-dev) — hot-reload para o servidor TypeScript
- [Prettier](https://prettier.io/) — formatação de código

---

## 📁 Estrutura do projeto

```
saude-conecta/
├── frontend/        # Interface web (React + Vite)
├── backend/         # API REST (Node.js + Express)
├── package.json     # Scripts e dependências raiz
└── .prettierrc      # Configuração de formatação
```

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/)
- Acesso a uma instância do **Microsoft SQL Server**

---

## 🔧 Instalação e execução

### 1. Clone o repositório

```bash
git clone https://github.com/gusthls/saude-conecta.git
cd saude-conecta
```

### 2. Instale as dependências da raiz

```bash
npm install
```

### 3. Instale as dependências do frontend e do backend

```bash
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `backend/` com as configurações de conexão ao banco de dados:

```env
DB_SERVER=seu_servidor
DB_PORT=1433
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco
```

### 5. Execute o projeto

Para rodar o frontend e o backend simultaneamente:

```bash
npm run dev
```

Ou individualmente:

```bash
# Apenas o backend
npm run dev:backend

# Apenas o frontend
npm run dev:frontend
```

---

## 📡 Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia frontend e backend em paralelo |
| `npm run dev:frontend` | Inicia apenas o frontend |
| `npm run dev:backend` | Inicia apenas o backend |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Faça o commit das suas alterações (`git commit -m 'feat: adiciona minha feature'`)
4. Faça o push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

| Nome | GitHub |
|---|---|
| Gustavo Henrique (gusthls) | [@gusthls](https://github.com/gusthls) |
| Gisele Bezerra de Almeida | [@GiseleBezerra](https://github.com/GiseleBezerra) |
| Jéssica Silva | [@jessica-silva-dev](https://github.com/jessica-silva-dev) |
| Victor | [@Victor-Cyber007](https://github.com/Victor-Cyber007) |
| Gustavo Urbano Alvarenga | [@Gustavo-Urbano-Alvarenga](https://github.com/Gustavo-Urbano-Alvarenga) |

### Integrantes na documentação

- Hugo Vinicius Soares Santos
- Jonas Marques de Oliveira 
- Tamires Dionizia de Jesus Alves 
