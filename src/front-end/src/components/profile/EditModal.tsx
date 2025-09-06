import React from 'react';
import { FiX, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { FreelancerProfileData, EmployerProfileData, ContactLink, Project } from '../../types/profileTypes';
//UserProfileData, Technology,
interface ModalBaseProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const ModalBase: React.FC<ModalBaseProps> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-indigo-950 border border-indigo-700 rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-indigo-300 hover:text-red-400">
          <FiX size={22} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-100">{title}</h2>
        {children}
      </div>
    </div>
  );
};

interface ModalFooterProps {
  onSave: () => void;
  onCancel: () => void;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ onSave, onCancel }) => {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <button onClick={onCancel} className="px-4 py-2 rounded bg-indigo-800 text-blue-200 hover:bg-indigo-700">
        Cancelar
      </button>
      <button onClick={onSave} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1">
        <FiSave /> Salvar
      </button>
    </div>
  );
};

interface EditModalProps {
  editingSection: string | null;
  tempProfileData: FreelancerProfileData | EmployerProfileData | null;
  newTechnology: { name: string; iconUrl: string };
  setNewTechnology: React.Dispatch<React.SetStateAction<{ id:string; name: string; iconUrl: string }>>;
  newContactLink: ContactLink;
  setNewContactLink: React.Dispatch<React.SetStateAction<ContactLink>>;
  newProject: Project;
  setNewProject: React.Dispatch<React.SetStateAction<Project>>;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleAddTechnology: () => void;
  handleRemoveTechnology: (id: string) => void;
  handleAddContactLink: () => void;
  handleRemoveContactLink: (index: number) => void;
  handleAddProject: () => void;
  handleRemoveProject: (id: string) => void;
  handleProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCoverImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (section: string) => void;
  closeEditModal: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  editingSection,
  tempProfileData,
  newTechnology,
  setNewTechnology,
  newContactLink,
  setNewContactLink,
  newProject,
  setNewProject,
  handleNameChange,
  handleAddTechnology,
  handleRemoveTechnology,
  handleAddContactLink,
  handleRemoveContactLink,
  handleAddProject,
  handleRemoveProject,
  handleProfilePictureChange,
  handleCoverImageChange,
  handleSave,
  closeEditModal,
}) => {
  if (!editingSection || !tempProfileData) return null;

  if (editingSection === 'nameAndTitle') {
    return (
      <ModalBase title="Editar Nome e Título" onClose={closeEditModal}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-blue-200">Nome completo</label>
            <input
              name="fullName"
              value={tempProfileData.fullName}
              onChange={handleNameChange}
              className="w-full rounded p-2 text-black"
            />
          </div>
          {tempProfileData.userType === 'freelancer' && (
            <div>
              <label className="block text-sm text-blue-200">Título profissional</label>
              <input
                name="title"
                value={(tempProfileData as FreelancerProfileData).title || ''}
                onChange={handleNameChange}
                className="w-full rounded p-2 text-black"
              />
            </div>
          )}
          {tempProfileData.userType === 'employer' && (
            <div>
              <label className="block text-sm text-blue-200">Nome da empresa</label>
              <input
                name="companyName"
                value={(tempProfileData as EmployerProfileData).companyName || ''}
                onChange={handleNameChange}
                className="w-full rounded p-2 text-black"
              />
            </div>
          )}
        </div>
        <ModalFooter onSave={() => handleSave('nome/título')} onCancel={closeEditModal} />
      </ModalBase>
    );
  }

  if (editingSection === 'bio') {
    return (
      <ModalBase title="Editar Bio/Descrição" onClose={closeEditModal}>
        <textarea
          name={tempProfileData.userType === 'freelancer' ? "bio" : "aboutCompany"}
          value={tempProfileData.userType === 'freelancer'
            ? (tempProfileData as FreelancerProfileData).bio || ''
            : (tempProfileData as EmployerProfileData).aboutCompany || ''}
          onChange={handleNameChange}
          rows={5}
          className="w-full rounded p-2 text-black"
        />
        <ModalFooter onSave={() => handleSave('bio')} onCancel={closeEditModal} />
      </ModalBase>
    );
  }

  if (editingSection === 'location') {
    return (
      <ModalBase title="Editar Localização" onClose={closeEditModal}>
        <input
          name="location"
          value={tempProfileData.location || ''}
          onChange={handleNameChange}
          className="w-full rounded p-2 text-black"
        />
        <ModalFooter onSave={() => handleSave('localização')} onCancel={closeEditModal} />
      </ModalBase>
    );
  }

  if (editingSection === 'technologies' && tempProfileData.userType === 'freelancer') {
    return (
      <ModalBase title="Editar Tecnologias" onClose={closeEditModal}>
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              placeholder="Nome da tecnologia"
              value={newTechnology.name}
              onChange={e => setNewTechnology(nt => ({ ...nt, name: e.target.value }))}
              className="rounded p-2 text-black flex-1"
            />
            <input
              placeholder="URL do ícone (opcional)"
              value={newTechnology.iconUrl}
              onChange={e => setNewTechnology(nt => ({ ...nt, iconUrl: e.target.value }))}
              className="rounded p-2 text-black flex-1"
            />
            <button
              onClick={handleAddTechnology}
              className="bg-indigo-600 text-white p-2 rounded"
            >
              <FiPlus />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(tempProfileData as FreelancerProfileData).technologies.map(tech => (
              <span key={tech.id} className="flex items-center bg-indigo-800 px-2 py-1 rounded text-white text-xs">
                {tech.name}
                <button onClick={() => handleRemoveTechnology(tech.id)} className="ml-1 text-red-300">
                  <FiTrash2 size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
        <ModalFooter onSave={() => handleSave('tecnologias')} onCancel={closeEditModal} />
      </ModalBase>
    );
  }

  if (editingSection === 'contactLinks' && tempProfileData.userType === 'freelancer') {
    return (
      <ModalBase title="Editar Contatos" onClose={closeEditModal}>
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <select
              value={newContactLink.type}
              onChange={e => setNewContactLink(nc => ({ ...nc, type: e.target.value as ContactLink['type'] }))}
              className="rounded p-2 text-black"
            >
              <option value="email">Email</option>
              <option value="phone">Telefone</option>
              <option value="linkedin">LinkedIn</option>
              <option value="github">GitHub</option>
              <option value="behance">Behance</option>
              <option value="portfolio">Portfólio</option>
              <option value="other">Outro</option>
            </select>
            <input
              placeholder="Valor"
              value={newContactLink.value}
              onChange={e => setNewContactLink(nc => ({ ...nc, value: e.target.value }))}
              className="rounded p-2 text-black flex-1"
            />
            <input
              placeholder="Rótulo (opcional)"
              value={newContactLink.label}
              onChange={e => setNewContactLink(nc => ({ ...nc, label: e.target.value }))}
              className="rounded p-2 text-black flex-1"
            />
            <button
              onClick={handleAddContactLink}
              className="bg-indigo-600 text-white p-2 rounded"
            >
              <FiPlus />
            </button>
          </div>
          <div className="space-y-1">
            {(tempProfileData as FreelancerProfileData).contactLinks.map((link, idx) => (
              <div key={idx} className="flex items-center bg-indigo-800 px-2 py-1 rounded text-white text-xs justify-between">
                <span>{link.label ? `${link.label}: ` : ''}{link.value}</span>
                <button onClick={() => handleRemoveContactLink(idx)} className="ml-2 text-red-300">
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <ModalFooter onSave={() => handleSave('contatos')} onCancel={closeEditModal} />
      </ModalBase>
    );
  }

  if (editingSection === 'projects' && tempProfileData.userType === 'freelancer') {
    return (
      <ModalBase title="Editar Projetos" onClose={closeEditModal}>
        <div className="mb-4">
          <div className="flex flex-col gap-2 mb-3">
            <input
              placeholder="Título do projeto"
              value={newProject.title}
              onChange={e => setNewProject(np => ({ ...np, title: e.target.value }))}
              className="rounded p-2 text-black"
            />
            <input
              placeholder="URL da imagem"
              value={newProject.imageUrl}
              onChange={e => setNewProject(np => ({ ...np, imageUrl: e.target.value }))}
              className="rounded p-2 text-black"
            />
            <input
              placeholder="URL do projeto"
              value={newProject.projectUrl}
              onChange={e => setNewProject(np => ({ ...np, projectUrl: e.target.value }))}
              className="rounded p-2 text-black"
            />
            <textarea
              placeholder="Descrição"
              value={newProject.description}
              onChange={e => setNewProject(np => ({ ...np, description: e.target.value }))}
              className="rounded p-2 text-black"
            />
            <button
              onClick={handleAddProject}
              className="bg-indigo-600 text-white p-2 rounded flex items-center gap-1"
            >
              <FiPlus /> Adicionar Projeto
            </button>
          </div>
          <div className="space-y-2">
            {(tempProfileData as FreelancerProfileData).projects?.map((project) => (
              <div key={project.id} className="flex items-center bg-indigo-800 px-2 py-1 rounded text-white text-xs justify-between">
                <span>{project.title}</span>
                <button onClick={() => handleRemoveProject(project.id)} className="ml-2 text-red-300">
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <ModalFooter onSave={() => handleSave('projetos')} onCancel={closeEditModal} />
      </ModalBase>
    );
  }

  if (editingSection === 'profilePicture') {
    return (
      <ModalBase title="Editar Foto de Perfil" onClose={closeEditModal}>
        <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="mb-4" />
        {tempProfileData.profilePictureUrl && (
          <img src={tempProfileData.profilePictureUrl} alt="Nova foto" className="w-32 h-32 rounded-full mx-auto" />
        )}
        <ModalFooter onSave={() => handleSave('foto de perfil')} onCancel={closeEditModal} />
      </ModalBase>
    );
  }

  if (editingSection === 'coverImage') {
    return (
      <ModalBase title="Editar Imagem de Capa" onClose={closeEditModal}>
        <input type="file" accept="image/*" onChange={handleCoverImageChange} className="mb-4" />
        {tempProfileData.coverImageUrl && (
          <img src={tempProfileData.coverImageUrl} alt="Nova capa" className="w-full h-40 object-cover rounded" />
        )}
        <ModalFooter onSave={() => handleSave('imagem de capa')} onCancel={closeEditModal} />
      </ModalBase>
    );
  }

  if (editingSection === 'addProject' && tempProfileData.userType === 'freelancer') {
    return (
      <ModalBase title="Adicionar Projeto" onClose={closeEditModal}>
        <div className="flex flex-col gap-2">
          <input
            placeholder="Título do projeto"
            value={newProject.title}
            onChange={e => setNewProject(np => ({ ...np, title: e.target.value }))}
            className="rounded p-2 text-black"
          />
          <input
            placeholder="URL da imagem"
            value={newProject.imageUrl}
            onChange={e => setNewProject(np => ({ ...np, imageUrl: e.target.value }))}
            className="rounded p-2 text-black"
          />
          <input
            placeholder="URL do projeto"
            value={newProject.projectUrl}
            onChange={e => setNewProject(np => ({ ...np, projectUrl: e.target.value }))}
            className="rounded p-2 text-black"
          />
          <textarea
            placeholder="Descrição"
            value={newProject.description}
            onChange={e => setNewProject(np => ({ ...np, description: e.target.value }))}
            className="rounded p-2 text-black"
          />
          <button
            onClick={handleAddProject}
            className="bg-indigo-600 text-white p-2 rounded flex items-center gap-1"
          >
            <FiPlus /> Adicionar Projeto
          </button>
        </div>
        <ModalFooter onSave={() => handleSave('projetos')} onCancel={closeEditModal} />
      </ModalBase>
    );
  }

  return null;
};

export default EditModal;
