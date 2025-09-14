import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { FreelancerProfileData } from '../../types/profileTypes';

interface ProjectsSectionProps {
  freelancerData: FreelancerProfileData | null;
  isOwner: boolean;
  openEditModal: (section: string) => void;
  renderEditButton: (section: string) => React.ReactNode;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ freelancerData, isOwner, openEditModal, renderEditButton }) => {
  if (!freelancerData) return null;

const handleEditProject = (_projectId: string) => {
  openEditModal('projects');
};

  return (
    <section className="md:col-span-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-100">Projetos</h2>
        {renderEditButton('projects')}
      </div>
      {freelancerData.projects && freelancerData.projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {freelancerData.projects.map((project) => (
            <div
              onClick={()=>handleEditProject(project.id)}
              key={project.id}
              className="bg-indigo-900/50 border border-indigo-800 rounded-xl shadow-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/30 cursor-pointer"
            >
              <img
                src={project.imageUrl || 'https://via.placeholder.com/400x220?text=Projeto'}
                alt={project.title}
                className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-blue-100 truncate" title={project.title}>{project.title}</h3>
              {project.description && <p className="text-sm text-indigo-300 mt-1 mb-2 h-10 overflow-hidden text-ellipsis">{project.description}</p>}
              {project.projectUrl && (
                <a
                  href={project.projectUrl.startsWith('http') ? project.projectUrl : `https://${project.projectUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-400 hover:text-indigo-200 hover:underline inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()} //previne abrir modal a clickar no link
                >
                  Ver Projeto <FiExternalLink size={12} />
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-indigo-900/30 rounded-xl">
          <p className="text-indigo-300">{isOwner ? "Você ainda não adicionou nenhum projeto." : "Nenhum projeto listado."}</p>
          {isOwner && (
            <button
              onClick={() => openEditModal('addProject')}
              className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:brightness-110 transition-all"
            >
              Adicionar Projeto
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
