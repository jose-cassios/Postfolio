import React from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { UserProfileData, FreelancerProfileData, EmployerProfileData } from '../../types/profileTypes';

interface UserProfileHeaderProps {
  profileData: FreelancerProfileData | EmployerProfileData;
  isOwner: boolean;
  openEditModal: (section: string) => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ profileData, isOwner, openEditModal }) => {
  return (
    <section className="w-full h-56 sm:h-64 bg-gradient-to-r relative">
      {profileData.coverImageUrl && (
        <img
          src={profileData.coverImageUrl}
          alt="Banner de Perfil"
          className="w-full h-full object-cover absolute mix-blend-overlay opacity-60"
        />
      )}
      <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8 p-1 bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 rounded-full">
        <img
          src={profileData.profilePictureUrl || '/woman.png'}
          alt={profileData.fullName}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-indigo-500 shadow-xl object-cover"
        />
      </div>
      {isOwner && profileData.userType === 'freelancer' && (
        <button
          onClick={() => openEditModal('profilePicture')}
          className="absolute bottom-7 left-28 sm:left-32 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white shadow-md"
          aria-label="Editar foto de perfil"
        >
          <FiEdit2 size={16} />
        </button>
      )}
      {isOwner && profileData.userType === 'freelancer' && (
        <button
          onClick={() => openEditModal('coverImage')}
          className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-lg text-white text-xs sm:text-sm flex items-center gap-1"
          aria-label="Editar imagem de capa"
        >
          <FiEdit2 size={14} /> <span>Editar Capa</span>
        </button>
      )}
    </section>
  );
};

export default UserProfileHeader;
