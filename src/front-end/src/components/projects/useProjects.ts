// import { useState, useEffect } from "react";

// interface Project {
//   title: string;
//   description: string;
//   image: string;
// }

// export default function useProjects() {
//   const [projects, setProjects] = useState<Project[]>([]);

//   useEffect(() => {
//     setProjects([
//       {
//         title: "Projeto 1",
//         description: "Descrição breve do projeto 1.",
//         image: "https://source.unsplash.com/400x300/?technology",
//       },
//       {
//         title: "Projeto 2",
//         description: "Descrição breve do projeto 2.",
//         image: "https://source.unsplash.com/400x300/?design",
//       },
//       {
//         title: "Projeto 3",
//         description: "Descrição breve do projeto 3.",
//         image: "https://source.unsplash.com/400x300/?innovation",
//       },
//     ]);
//   }, []);

//   return projects;
// }

// const projects = [
//     {
//       title: "José Cassios",
//       role: "Desenvolvedor Full Stack",
//       frontImage: "cassios.png",
//       backContent: "Desenvolvedor apaixonado por tecnologia, focado em soluções inovadoras e experiência do usuário.",
//       portfolioLink: "http://localhost:5174/",
//       emailContact: "josecassios@email.com"
//     },
//     {
//       title: "Mickaela Evely",
//       role: "Desenvolvedora Frontend e games mobile",
//       frontImage: "micka.png",
//       backContent: "Estudante determinada e focada, sempre em busca de novos desafios e dedicada ao aprimoramento contínuo de suas habilidades.",
//       portfolioLink: "http://localhost:5174/",
//       emailContact: "micka@email.com"
//     },
//   ];