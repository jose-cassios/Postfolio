/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useProfile } from '../components/profile/ProfileContext';
import UserProfileLayout from '../layouts/UserProfileLayout';
import { UserProfileData, FreelancerProfileData, EmployerProfileData, ContactLink, Project, Technology } from '../types/profileTypes';


export default function UserProfilePage() {

  const { userId: routeUserId } = useParams<{ userId: string }>();
  const {getProfile, updateProfile, isLoggedInUser} = useProfile();

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempProfileData, setTempProfileData] = useState<FreelancerProfileData | EmployerProfileData | null>(null);
  const [newTechnology, setNewTechnology] = useState<Technology>({ id: '', name: '', iconUrl: '' });
  const [newContactLink, setNewContactLink] = useState<ContactLink>({ type: 'other', value: '', label: '' });
  const [newProject, setNewProject] = useState<Project>({ id: '', title: '', imageUrl: '', description: '', projectUrl: '' });

  useEffect(() => {
    if(!routeUserId){
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    
    //aplica um delay no carregamento
    setTimeout(() => {
      const fetchedData = getProfile(routeUserId);

      if (fetchedData) {
        setProfileData(fetchedData);
        setIsOwner(isLoggedInUser(fetchedData.userId));
      }else{
        setProfileData(null);
        setIsOwner(false);
      }

      setIsLoading(false);
    }, 300);
  }, [routeUserId, getProfile, isLoggedInUser]);

  const openEditModal = (section: string) => {
    setTempProfileData(JSON.parse(JSON.stringify(profileData)));
    setEditingSection(section);
  };

  const closeEditModal = () => {
    setEditingSection(null);
    setTempProfileData(null);
    setNewTechnology({ id: '', name: '', iconUrl: '' });
    setNewContactLink({ type: 'other', value: '', label: '' });
    setNewProject({ id: '', title: '', imageUrl: '', description: '', projectUrl: '' });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!tempProfileData) return;
    const { name, value } = e.target;
    setTempProfileData((prev: FreelancerProfileData | EmployerProfileData | null) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleAddTechnology = () => {
    if (!tempProfileData || tempProfileData.userType !== 'freelancer') return;
    if (!newTechnology.name.trim()) return; // Certifique-se que o nome da tecnologia não está vazio

    setTempProfileData((prev) => {
        if (!prev || prev.userType !== 'freelancer') return prev;

        // Garanta que `technologies` seja um array antes de adicionar
        const freelancerPrev = prev as FreelancerProfileData;
        const currentTechnologies = freelancerPrev.technologies || [];
        return {
            ...freelancerPrev,
            technologies: [
                ...currentTechnologies,
                { ...newTechnology, 
                  id: Date.now().toString(),
                  name: newTechnology.name.trim() // remove espaços extras
                 } // Adiciona ID único
            ]
        };
    });
    setNewTechnology({ id: '', name: '', iconUrl: '' }); // Resetar o estado de nova tecnologia
};


  const handleRemoveTechnology = (id: string) => {
    if (!tempProfileData || tempProfileData.userType !== 'freelancer') return;
    
    setTempProfileData((prev) => {
      if (!prev || prev.userType !== 'freelancer') return prev;
      
      const freelancerPrev = prev as FreelancerProfileData;
      const currentTechnologies = freelancerPrev.technologies || [];

      return {
        ...freelancerPrev,
        technologies: currentTechnologies.filter((t) => t.id !== id)
      };
    });
  };

  const handleAddContactLink = () => {
    if (!tempProfileData || tempProfileData.userType !== 'freelancer') return;
    if (!newContactLink.value) return;
    setTempProfileData((prev: FreelancerProfileData | EmployerProfileData | null) => {
      if (!prev || prev.userType !== 'freelancer') return prev;
      const currentContactLinks = Array.isArray(prev.contactLinks) ? prev.contactLinks : [];
      return {
        ...prev,
        contactLinks: [
          ...currentContactLinks,
          { ...newContactLink }
        ]
      };
    });
    setNewContactLink({ type: 'other', value: '', label: '' });
  };

  const handleRemoveContactLink = (index: number) => {
    if (!tempProfileData || tempProfileData.userType !== 'freelancer') return;
    setTempProfileData((prev: FreelancerProfileData | EmployerProfileData | null) => {
      if (!prev || prev.userType !== 'freelancer') return prev;
      return {
        ...prev,
        contactLinks: prev.contactLinks.filter((_: unknown, i: number) => i !== index)
      };
    });
  };

  const handleAddProject = () => {
    if (!tempProfileData || tempProfileData.userType !== 'freelancer') return;
    if (!newProject.title) return;
    setTempProfileData((prev: FreelancerProfileData | EmployerProfileData | null) => {
      if (!prev || prev.userType !== 'freelancer') return prev;
      const currentProjects = Array.isArray(prev.projects) ? prev.projects : [];
      return {
        ...prev,
        projects: [
          ...currentProjects,
          { ...newProject, id: Date.now().toString() }
        ]
      };
    });
    setNewProject({ id: '', title: '', imageUrl: '', description: '', projectUrl: '' });
  };

  const handleRemoveProject = (id: string) => {
    if (!tempProfileData || tempProfileData.userType !== 'freelancer') return;
    setTempProfileData((prev: FreelancerProfileData | EmployerProfileData | null) => {
      if (!prev || prev.userType !== 'freelancer') return prev;
      return {
        ...prev,
        projects: (prev.projects || []).filter((p: { id: string; }) => p.id !== id)
      };
    });
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && tempProfileData) {
      const file = e.target.files[0];
      const pictureUrl = URL.createObjectURL(file);
      setTempProfileData((prev: unknown) => ({ ...prev!, profilePictureUrl: pictureUrl }) as UserProfileData);
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && tempProfileData) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setTempProfileData((prev: unknown) => ({ ...prev!, coverImageUrl: imageUrl }) as UserProfileData);
    }
  };

  const handleSave = (section: string) => {
    if (tempProfileData) {
      //atualiza o contexto
      updateProfile(tempProfileData);

      setProfileData(tempProfileData);
    }
    closeEditModal();
    alert(`${section.charAt(0).toUpperCase() + section.slice(1)} atualizado com sucesso! (Simulação)`);
  };

  return (
    <UserProfileLayout
      profileData={profileData}
      isLoading={isLoading}
      isOwner={isOwner}
      editingSection={editingSection}
      tempProfileData={tempProfileData}
      newTechnology={newTechnology}
      setNewTechnology={setNewTechnology}
      newContactLink={newContactLink}
      setNewContactLink={setNewContactLink}
      newProject={newProject}
      setNewProject={setNewProject}
      openEditModal={openEditModal}
      closeEditModal={closeEditModal}
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
    />
  );
}
