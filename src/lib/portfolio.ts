export const portfolio = {
  name: "Leonardo Arruda",
  role: "Desenvolvedor Fullstack",
  headline:
    "Desenvolvedor fullstack com foco em Node.js, React, TypeScript e PostgreSQL — do backend à interface.",
  location: "Itajaí, Santa Catarina, Brasil",
  about:
    "Desenvolvedor fullstack em formação, com projetos práticos que unem API, banco de dados relacional e interfaces modernas. Trabalho com Node.js, React, TypeScript e PostgreSQL para construir aplicações completas e escaláveis. Busco oportunidades para contribuir com times de desenvolvimento e continuar evoluindo na stack fullstack.",
  education: {
    institution: "Estácio",
    course: "Análise e Desenvolvimento de Sistemas",
    period: "2025 — 2027",
  },
  contact: {
    email: "leonardoarrudacontato@gmail.com",
    phone: "47999641996",
    phoneDisplay: "(47) 99964-1996",
    github: "https://github.com/leonarddoarruda",
    linkedin: "https://linkedin.com/in/leonardo-arruda-993aa6303",
  },
  skills: [
    "Node.js",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Next.js",
    "Prisma",
    "REST API",
    "JavaScript (ES6+)",
    "Git & GitHub",
    "HTML5 & CSS3",
  ],
  projects: [
    {
      title: "StudioFlow",
      description:
        "Sistema fullstack para gestão de salões de beleza: agendamentos, financeiro, estoque, equipe e notificações WhatsApp.",
      stack: ["Next.js", "React", "TypeScript", "Node.js", "Prisma", "PostgreSQL"],
      github: "https://github.com/leonarddoarruda/studioflow",
      demo: "/login",
      featured: true,
    },
    {
      title: "Controle Financeiro Pessoal",
      description:
        "Dashboard web para gerenciar entradas, saídas e investimentos com cálculos automáticos e persistência via LocalStorage.",
      stack: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
      github:
        "https://github.com/leonarddoarruda/Sistema-de-Controle-finan-as-pessoal",
      demo: null,
      featured: true,
    },
    {
      title: "Site Hamburgueria",
      description:
        "Site institucional responsivo com foco em semântica HTML, Flexbox, UI/UX e navegação intuitiva.",
      stack: ["HTML5", "CSS3", "Flexbox", "UI/UX"],
      github: "https://github.com/leonarddoarruda/Site-hamburgueria",
      demo: null,
      featured: false,
    },
    {
      title: "Cadastro de Usuário",
      description:
        "Aplicação web para cadastro e gestão de usuários, reforçando manipulação de DOM e validação de formulários.",
      stack: ["HTML5", "CSS3", "JavaScript"],
      github: "https://github.com/leonarddoarruda/Cadastro-De-Usuario",
      demo: null,
      featured: false,
    },
    {
      title: "Tela de Login",
      description:
        "Interface de login moderna e responsiva, com layout centralizado e boas práticas de usabilidade.",
      stack: ["HTML5", "CSS3", "UI/UX"],
      github: "https://github.com/leonarddoarruda/Web-Login",
      demo: null,
      featured: false,
    },
  ],
} as const;
