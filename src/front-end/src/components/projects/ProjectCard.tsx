import React from 'react';

interface ProjectCardProps {
  title: string;
  role: string;
  frontImage: string;
  backContent: string;
  portfolioLink: string;
  emailContact: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  role,
  frontImage,
  backContent,
  // portfolioLink,
  emailContact,
}) => {
  return (
    <div className="w-[280px] h-[360px] perspective group cursor-pointer">
      <div className="relative w-full h-full transition-transform duration-700 transform-style preserve-3d group-hover:rotate-y-180">
        <div className="group [perspective:1000px] w-80 h-96 relative">
          <div className="relative w-full h-full duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden bg-gradient-to-b from-[#290e3e] to-[#1a1944] rounded-2xl shadow-md overflow-hidden font-sans">
              <div className="bg-gradient-to-b from-[#ae40ac] to-[#290e3e] p-4 text-center">
                <img src={frontImage} alt={`Logo ${title}`} className="w-32 h-auto mx-auto" />
              </div>
              <div className="p-5 text-center">
                <p className="text-sm text-zinc-300 mb-2">{role}</p>
                <h2 className="text-3xl text-blue-600 mb-4 font-semibold">{title}</h2>
                <p className="text-center text-sm px-4">{backContent}</p>
              </div>
            </div>
            {/* Back */}
            <div
              className="absolute w-full h-full backface-hidden rounded-2xl shadow-md text-white flex flex-col items-center justify-center [transform:rotateY(180deg)]"
              style={{
                background: `
                  linear-gradient(to bottom, #290e3e, #1a1944)
                `,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Camada da imagem preta e branca, transparente, atrás do conteúdo */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: "url('flyplan.png')",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  opacity: 0.18,
                  filter: 'grayscale(1)',
                  zIndex: 0
                }}
              />
              {/* Conteúdo do card */}
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                <h3 className="text-lg font-bold mb-2">Sobre mim</h3>
                <p className="text-sm px-4">{backContent}</p>
                <a
                  href={`mailto:${emailContact}`}
                  className="mt-4 inline-block px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Entrar em contato
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
