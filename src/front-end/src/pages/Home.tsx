import Header from "../layouts/Header";
// import ProjectCard from '../components/projects/ProjectCard';
import ProjectCarousel from '../components/projects/ProjectCarousel';
import ParticleComponent from "../components/ParticleComponent";

const projects = [
    {
      title: "José Cassios",
      role: "Desenvolvedor Full Stack",
      frontImage: "cassios.png",
      backContent: "Desenvolvedor apaixonado por tecnologia, focado em soluções inovadoras e experiência do usuário.",
      portfolioLink: "http://localhost:5174/",
      emailContact: "josecassios@email.com"
    },
    {
      title: "Mickaela Evely",
      role: "Desenvolvedora Frontend e games mobile",
      frontImage: "micka.png",
      backContent: "Estudante determinada e focada, sempre em busca de novos desafios e dedicada ao aprimoramento contínuo de suas habilidades.",
      portfolioLink: "http://localhost:5174/",
      emailContact: "micka@email.com"
    },
    {
      title: "Debriane da Silva",
      role: "Leitora profissional de livros de romance",
      frontImage: "debriane.png",
      backContent: "Leio de tudo, não só romance.",
      portfolioLink: "http://localhost:5174/",
      emailContact: "micka@email.com"
    },
    {
      title: "Juan Pablo",
      role: "Desenvolvedor Backend e DevOps",
      frontImage: "juan.png",
      backContent: "Desenvolvo qualquer sistema backend avançado, tenho experiencia em integração, devops, testes e desenvolvimento ágil.",
      portfolioLink: "http://localhost:5174/",
      emailContact: "juan@email.com"
    },
    {
      title: "Jonas Davi Nogueira",
      role: "Contador, e gerente de projetos",
      frontImage: "jonas.png",
      backContent: "Se você busca alguém comprometido com resultados, organização e liderança, posso transformar ideias em entregas concretas.",
      portfolioLink: "http://localhost:5174/",
      emailContact: "juan@email.com"
    },
    {
      title: "Lara Emanuelly",
      role: "CEO e Advogada",
      frontImage: "lara.png",
      backContent: "Conte com a expertise de Lara Emanuelly, CEO visionária e advogada dedicada, para impulsionar o sucesso do seu negócio. Com liderança estratégica, profundo conhecimento jurídico e foco em resultados.",
      portfolioLink: "http://localhost:5174/",
      emailContact: "lara@email.com"
    },
  ];

export default function Home()  {
  return (
    <div className="bg-pattern bg-no-repeat bg-top bg-cover min-h-screen w-full text-light-white relative">
      <ParticleComponent />
      <div className="relative z-10">
        <Header />
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-10 py-16 gap-10">
          {/* Texto - Fica primeiro no mobile, mas mantém a posição no desktop */}
          <div className="flex flex-col items-center md:items-center justify-right space-y-5 max-w-[600px] order-1 md:order-1">
            <h1 className="text-light-white text-[60px] font-bold text-center md:text-left">
              <span className="">A competição de Portfólios começou!</span>
            </h1>
            {/* <h2 className="text-xl font-semibold text-light-blue text-center md:text-left">Design, Frontend e Backend</h2> */}
            <p className="text-justify justify-center leading-relaxed">
              A competição foi uma ideia para incentivar a criatividade e o espírito competitivo entre os alunos. Explore o <span>portfólio</span> dos alunos e vote no seu projeto favorito! Seu voto é importante para deixar a competição ainda mais interessante.
            </p>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-gradient-to-t from-[#322d92] to-[#882a69] text-light-white rounded-3xl hover:bg-opacity-80 hover:text-[#709FA9] transition">
                Veja os competidores
              </button>
              <button className="px-4 py-2 bg-gradient-to-t from-[#322d92] to-[#882a69] text-light-white rounded-3xl hover:bg-opacity-80 hover:text-dark-black transition">
                Participante da competição
              </button>
            </div>
            <h1 className="text-light-white text-[33px] font-bold text-center md:text-left">
            </h1>
          </div>
          <div className="flex justify-end md:w-[50%] order-2 md:order-1">
            <img src="pages-img.png" alt="Imagem de competição" />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center px-6 md:px-10 py-16 gap-10">

          <div className="flex flex-col items-center justify-center space-y-5 order-1 md:order-1">
            <h1 className="text-light-white text-[33px] font-bold text-center md:text-left">
              1. O que é a competição?
            </h1>

            <div className="flex flex-col gap-3">

              <h2 className="text-lg text-zinc-50">Objetivo</h2>
              <div className="flex flex-col w-full mb-10 relative">
                <label className="bg-[#9E2777] shadow-shape px-10 py-5 text-light-white rounded-2xl md:rounded-full transition whitespace-normal text-center max-w-screen-md w-full sm:min-h-[100px] min-h-[150px] flex items-center justify-center relative">
                  O objetivo principal da competição foi estimular o desenvolvimento dos alunos, o compartilhamento de experiência e um passatempo durante as férias!
                </label>
                <img src="cup.png" alt="Img" className="absolute top-20 -left-10 w-32 h-32 sm:-top-5 sm:-left-20 sm:w-40 sm:h-40" />
              </div>

              <h2 className="text-lg text-zinc-50">Quem está participando?</h2>
              <div className="flex flex-col w-full mb-20 relative">
                <label className="bg-[#9E2777] shadow-shape px-10 py-5 text-light-white rounded-2xl md:rounded-full transition whitespace-normal text-center max-w-screen-md w-full sm:min-h-[100px] min-h-[150px] flex items-center justify-center relative">
                  Os participantes são os alunos de Ciências da Computação da turma de CC10.
                </label>
                <img src="woman.png" alt="Img" className="absolute top-20 right-[-40px] w-32 h-32 sm:-top-0 sm:right-[-60px] sm:w-40 sm:h-40" />
              </div>

            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-5 order-1 md:order-1 max-w-screen-lg mx-auto px4">
            <h1 className="text-light-white text-[33px] font-bold text-center md:text-left">
              2. Critérios para avaliação
            </h1>

            <div className="flex flex-col sm:flex-row justify-between gap-6 mt-10 w-full">
              {/* Card 1 */}
              <div className="bg-dark-blue text-white border-blue-950 border-4 rounded-2xl p-6 shadow-lg flex-1 min-w-[250px] max-w-sm">
                <h3 className="text-xl font-bold mb-4 text-center">🎨 Design e Estética</h3>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                  <li>Criatividade</li>
                  <li>Layout</li>
                  <li>Cores e Tipografia</li>
                </ul>
              </div>

              {/* Card 2 */}
              <div className="bg-dark-blue text-white border-blue-950 border-4 rounded-2xl p-6 shadow-lg flex-1 min-w-[250px] max-w-sm">
                <h3 className="text-xl font-bold mb-4 text-center">⚙️ Funcionalidade e Performance</h3>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                  <li>Adequação ao Propósito</li>
                  <li>Escalabilidade</li>
                  <li>Confiabilidade</li>
                </ul>
              </div>

              {/* Card 3 */}
              <div className="bg-dark-blue text-white border-blue-950 border-4 rounded-2xl p-6 shadow-lg flex-1 min-w-[250px] max-w-sm">
                <h3 className="text-xl font-bold mb-4 text-center">🧭 Usabilidade do Usuário</h3>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                  <li>Navegação Intuitiva</li>
                  <li>Acessibilidade e Legibilidade</li>
                  <li>Facilidade de Uso</li>
                </ul>
              </div>
            </div>
        



          </div>

          <div className="flex flex-col items-center justify-center space-y-5 order-1 md:order-1 w-full px-4 sm:px-10 max-w-screen-lg mx-auto ">
            <h1 className="text-light-white text-[33px] font-bold text-center w-full">
              3. Conheça os Participantes
            </h1>
            <div className="w-full overflow-x-auto">
              <div className="relative w-full max-w-full overflow-x-visible flex justify-center">
                <ProjectCarousel projects={projects} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
<h1 className="text-light-white text-[38px] font-bold text-center md:text-left">
  Critérios para a Avalição
</h1>