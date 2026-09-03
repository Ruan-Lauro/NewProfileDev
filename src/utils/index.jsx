

const navLinks = [
  {
    id: 1,
    name: 'Sobre',
    href: '#about',
  },
  {
    id: 2,
    name: 'Projetos',
    href: '#projects',
  },
  {
    id: 3,
    name: 'Experiências',
    href: '#experience',
  },
  {
    id: 4,
    name: 'Tecnologias',
    href: '#skills',
  },
  {
    id: 5,
    name: 'Contact',
    href: '#contact',
  },
];

const services = [
  {
    id: "about",
    title: "Um pouco sobre mim",
    description:
      "Sou desenvolvedor web com dois anos de experiência, especializado em tecnologias front-end e back-end. Tenho paixão por transformar ideias em aplicações funcionais, escaláveis e robustas, sempre buscando criar soluções tecnológicas que resolvam problemas reais e melhorem processos.",
  },

  {
    id: "journey",
    title: "Minha jornada na tecnologia",
    description:
      "Desde que comecei a programar, impulsionado pela paixão pela tecnologia, busco constantemente expandir meus conhecimentos e desenvolver novas habilidades. Meu objetivo é me tornar um desenvolvedor full-stack de destaque, preparado para enfrentar desafios, criar soluções inovadoras e contribuir efetivamente para o sucesso da equipe e o crescimento da empresa.",
  },

  {
    id: "education",
    title: "Formação acadêmica",

    items: [
      {
        label: "Análise e Desenvolvimento de Sistemas",
        text: "Tecnólogo — Instituto Federal do Piauí (IFPI), Picos | 2022 – 2025 | Concluído",
      },
      {
        label: "Técnico em Administração",
        text: "Senac, Picos | 2022 – 2023 | Concluído",
      },
      {
        label: "Técnico em Administração",
        text: "Instituto Federal do Piauí (IFPI), Picos | 2019 – 2022 | Concluído",
      },
    ],
  },
];

import one from "../assets/performance/performance1.png";
import two from "../assets/performance/performance2.png";
import three from "../assets/performance/performance3.png";
import four from "../assets/performance/performance4.png";
import five from "../assets/performance/performance5.png";
import six from "../assets/performance/performance6.png";
import seven from "../assets/performance/performance7.png";

const performanceImages = [
    { id: "p1", src: one, link:'https://github.com/Ruan-Lauro/RAG' },
    { id: "p2", src: two, link:'https://github.com/Ruan-Lauro/appleAnimation' },
    { id: "p3", src: three, link:'https://github.com/Ruan-Lauro/Igreja' },
    { id: "p4", src: four, link:'https://github.com/Ruan-Lauro/MuralVirtualMobile' },
    { id: "p5", src: five, link:'https://github.com/Ruan-Lauro/NewProfileDev' },
    { id: "p6", src: six, link:'https://github.com/Ruan-Lauro/Gobite' },
    { id: "p7", src: seven, link:'https://github.com/Ruan-Lauro/EvenTicket' },
];

const performanceImgPositions = 
[
    {
        id: "p1",
        left: 5,
        bottom: 65,
    },
    {
        id: "p2",
        right: 10,
        bottom: 60,
    },
    {
        id: "p3",
        right: -5,
        bottom: 45,
    },
    {
        id: "p4",
        right: -10,
        bottom: 0,
    },
    {
        id: "p5",
        left: 20,
        bottom: 50,
    },
    {
        id: "p6",
        left: 2,
        bottom: 30,
    },
    {
        id: "p7",
        left: -5,
        bottom: 0,
    },
];


const features = [
    {
        id: 1,
        icon: "../assets/feature-icon1.svg",
        highlight: "Associate Software Developer.",
        text: "Desenvolvimento e manutenção de sistemas legados, implementação de melhorias e criação de novas funcionalidades. Modelo de trabalho home office.",
        period: "12/2025 · Metadados Assessoria e Sistemas Ltda, Caxias do Sul – RS",
        techs: ["Remix", "Ruby on Rails", "C#"],
        styles: "left-5 md:left-20 top-[31%] md:top-[40%] opacity-0 translate-y-5",
    },
    {
        id: 2,
        icon: "../assets/feature-icon2.svg",
        highlight: "Professor de TI.",
        text: "Professor horista no turno da noite ministrando aulas na área de Tecnologia da Informação, com foco em Desenvolvimento de Sistemas.",
        period: "04/2026 – atual · Senac PI, Picos – PI",
        techs: ["Desenvolvimento de Sistemas", "TI"],
        styles: "right-5 md:right-20 top-[44%] md:top-[50%] opacity-0 translate-y-5",
    },
    {
        id: 3,
        icon: "../assets/feature-icon3.svg",
        highlight: "Estágio KBR – Front-End.",
        text: "Desenvolvimento e manutenção de sites com suporte técnico, criando soluções funcionais, responsivas e de fácil manutenção.",
        period: "Estágio · KBR",
        techs: ["PHP", "Laravel", "WordPress", "React", "Vue", "Angular", "Tailwind", "Sass", "MySQL"],
        styles: "left-5 md:left-20 top-[55%] md:top-[60%] opacity-0 translate-y-5",
    },
    {
        id: 4,
        icon: "../assets/feature-icon4.svg",
        highlight: "Mural Virtual.",
        text: "Aplicativo mobile para comunicação entre colaboradores de empresas e instituições. Selecionado em programas de startups do Nordeste.",
        period: "Aplicativo Mobile",
        techs: ["React Native", "Expo", "Node.js", "Express", "TypeScript", "PostgreSQL", "Supabase", "Prisma"],
        styles: "right-5 md:right-20 top-[68%] opacity-0 translate-y-5",
    },
    {
        id: 5,
        icon: "../assets/feature-icon5.svg",
        highlight: "Sistema para Igreja.",
        text: "Plataforma web com controle de cadastro e gestão financeira para inscrições de eventos, integrando front-end moderno com funcionalidades administrativas.",
        period: "Sistema Web",
        techs: ["Next.js", "React", "JavaScript"],
        styles: "left-5 md:left-20 top-[81%] opacity-0 translate-y-5",
    },
    {
        id: 6,
        icon: "../assets/feature-icon1.svg",
        highlight: "Financeiro de Lavanderia.",
        text: "Sistema desktop de controle financeiro para lavanderia, trazendo análise financeira mais simples e acessível.",
        period: "Software Desktop",
        techs: ["React", "Eclipse", "Sass"],
        styles: "right-5 md:right-20 top-[93%] opacity-0 translate-y-5",
    },
];

export default {
  navLinks,
  services,
  performanceImages,
  features,
  performanceImgPositions,
}
