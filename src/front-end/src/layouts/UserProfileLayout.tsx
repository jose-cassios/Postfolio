import React from 'react';
import Header from "./HeaderLayout";
import UserProfileHeader from '../components/profile/UserProfileHeader';
import UserInfoSidebar from '../components/profile/UserInfoSidebar';
import ProjectsSection from '../components/profile/ProjectsSection';
import EditModal from '../components/profile/EditModal';
import { UserProfileData, FreelancerProfileData, EmployerProfileData, ContactLink, Project } from '../types/profileTypes';
import { FiEdit2 } from 'react-icons/fi';
//, Technology
//FiBriefcase,
interface UserProfileLayoutProps {
  profileData: UserProfileData | null;
  isLoading: boolean;
  isOwner: boolean;
  editingSection: string | null;
  tempProfileData: FreelancerProfileData | EmployerProfileData | null;
  newTechnology: { name: string; iconUrl: string };
  setNewTechnology: React.Dispatch<React.SetStateAction<{ id:string; name: string; iconUrl: string }>>;
  newContactLink: ContactLink;
  setNewContactLink: React.Dispatch<React.SetStateAction<ContactLink>>;
  newProject: Project;
  setNewProject: React.Dispatch<React.SetStateAction<Project>>;
  openEditModal: (section: string) => void;
  closeEditModal: () => void;
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
}

const UserProfileLayout: React.FC<UserProfileLayoutProps> = ({
  profileData,
  isLoading,
  isOwner,
  editingSection,
  tempProfileData,
  newTechnology,
  setNewTechnology,
  newContactLink,
  setNewContactLink,
  newProject,
  setNewProject,
  openEditModal,
  closeEditModal,
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
}) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 min-h-screen flex items-center justify-center text-blue-100">
        Carregando perfil...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 min-h-screen flex items-center justify-center text-blue-100">
        Perfil não encontrado.
      </div>
    );
  }

  const renderEditButton = (section: string) => {
    if (isOwner && profileData.userType === 'freelancer') {
      return (
        <button
          onClick={() => openEditModal(section)}
          className="text-indigo-400 hover:text-indigo-200 transition-colors ml-2"
          aria-label={`Editar ${section}`}
        >
          <FiEdit2 size={18} />
        </button>
      );
    }
    return null;
  };

  const freelancerData = profileData.userType === 'freelancer' ? profileData as FreelancerProfileData : null;
  const employerData = profileData.userType === 'employer' ? profileData as EmployerProfileData : null;

  return (
    <div className="bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 min-h-screen text-blue-100 font-sans">
      <Header />
      <EditModal
        editingSection={editingSection}
        tempProfileData={tempProfileData}
        newTechnology={newTechnology}
        setNewTechnology={setNewTechnology}
        newContactLink={newContactLink}
        setNewContactLink={setNewContactLink}
        newProject={newProject}
        setNewProject={setNewProject}
        handleNameChange={handleNameChange}
        handleAddTechnology={handleAddTechnology}
        handleRemoveTechnology={handleRemoveTechnology}
        handleAddContactLink={handleAddContactLink}
        handleRemoveContactLink={handleRemoveContactLink}
        handleAddProject={handleAddProject}
        handleRemoveProject={handleRemoveProject}
        handleProfilePictureChange={handleProfilePictureChange}
        handleCoverImageChange={handleCoverImageChange}
        handleSave={handleSave}
        closeEditModal={closeEditModal}
      />

      <UserProfileHeader
        profileData={profileData}
        isOwner={isOwner}
        openEditModal={openEditModal}
      />

      <main className="container mx-auto px-4 py-8 pt-20 sm:pt-24 grid grid-cols-1 md:grid-cols-4 gap-8">
        <UserInfoSidebar
          profileData={profileData}
          isOwner={isOwner}
          openEditModal={openEditModal}
          renderEditButton={renderEditButton}
        />

        {freelancerData && (
          <ProjectsSection
            freelancerData={freelancerData}
            isOwner={isOwner}
            openEditModal={openEditModal}
            renderEditButton={renderEditButton}
          />
        )}
        
        {employerData && (
          <section className="md:col-span-3">
            <h2 className="text-2xl font-bold text-blue-100 mb-6">Vagas Abertas</h2>
            <div className="text-center py-10 bg-indigo-900/30 rounded-xl">
              <p className="text-indigo-300">{employerData.companyName} está sempre em busca de novos talentos!</p>
              <button
                onClick={() => alert("Redirecionando para a página de carreiras (simulação)...")}
                className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-md hover:brightness-110 transition-all"
              >
                Ver Oportunidades
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default UserProfileLayout;
