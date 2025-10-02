import React, {createContext, useContext,useState, ReactNode} from "react";
import { UserProfileData } from "../../types/profileTypes";

const MOCK_PROFILES: UserProfileData[] = [
    {
        userId:"jose-cassios",
        userType:'freelancer',
        username:"José Cassios",
        fullName:"José Cassios",
        profilePictureUrl:"/cassios.png",
        bio:"Desenvolvedor Full Stack com 10 anos de experiência em React, Node.js e Python. Apaixonado por criar soluções inovadoras e eficientes.",
        title:"Engenheiro de Software Full Stack",
        location:"Caxias, Brasil",
        availableForWork:true,
        technologies:[
            { id: "1", name: "React", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
            { id: "2", name: "Node.js", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
            { id: "3", name: "TypeScript" },
            { id: "4", name: "Python", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"},
            { id: "5", name: "Figma", iconUrl: "https://www.vectorlogo.zone/logos/figma/figma-icon.svg" },
        ],
        contactLinks:[
            { type: 'email', value: 'cassios.torres.010@gmail.com' },
            { type: 'linkedin', value: 'linkedin.com/in/cassios-torres' },
            { type: 'github', value: 'github.com/cassios-torres' },
            { type: 'portfolio', value: 'cassios-torres.dev', label: 'Meu Portfólio' },
  
        ],
        projects:[
            { id: "p1", title: "Plataforma de E-learning Interativa", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80", description: "Plataforma completa com cursos, quizzes e acompanhamento de progresso." },
            { id: "p2", title: "API Segura para Mobile Banking", imageUrl: "https://images.unsplash.com/photo-1518770660439-463061962052?auto=format&fit=crop&w=400&q=80", description: "Backend robusto para aplicativo financeiro." },
            { id: "p3", title: "Dashboard Analítico de Vendas", imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80", description: "Visualização de dados para tomada de decisão." },

        ],
    },
    {
        userId:"jonasdavi",
        userType: "freelancer",
        username: "jonasdavi",
        fullName: "Jonas Davi",
        profilePictureUrl:"/jonas.png",
        bio:"Desenvolvedor desenvolvedor, desenvolvedor e desenvolvedor..",
        title:"Professor e desenvolvedor de software",
        location:"Caxias, Brasil",
        availableForWork:true,
        technologies:[
            { id: "1", name: "React", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
            { id: "2", name: "TypeScript" },
            { id: "3", name: "Python", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"},
        ],
        contactLinks:[
            { type: 'email', value: 'jodavir475@gmail.com' },
            { type: 'linkedin', value: 'linkedin.com/in/jonas-nogueira01' },
            { type: 'github', value: 'github.com/JonasNogueiraS' },
            { type: 'portfolio', value: 'github.com/JonasNogueiraS', label: 'Meu Portfólio' },
        ],
        projects:[
            { id: "p1", title: "Landing Page Criativa", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", description: "Landing page responsiva com design moderno e foco em conversão." },
        ],
    },    
];

interface ProfileContextType{
    getProfile: (profileId: string) => UserProfileData | null;
    updateProfile: (updatedProfile: UserProfileData)=> void;
    isLoggedInUser: (profileId: string) => boolean;
    loggedInUserId: string;
    setLoggedInUser:(userId: string)=> void;
    getAllProfiles: () => UserProfileData[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps{
    children: ReactNode;
}

export function ProfileProvider({children}: ProfileProviderProps){
    // Estado para controlar qual usuário está "logado" (editável)
    const [loggedInUserId, setLoggedInUserId] = useState<string>("");

    const getProfile = (profileId: string): UserProfileData | null =>{
        return MOCK_PROFILES.find(profile => profile.userId === profileId) || null;
    };
    const updateProfile = (updatedProfile: UserProfileData) =>{
        const profileIndex = MOCK_PROFILES.findIndex(p => p.userId === updatedProfile.userId);
        if (profileIndex !== -1){
            MOCK_PROFILES[profileIndex] = updatedProfile;
        }
    };
    const isLoggedInUser = (profileId: string): boolean =>{
        const editableUsers = ["jonasdavi"];
        return editableUsers.includes(profileId)
    };

    const setLoggedInUser = (userId: string) => {
        setLoggedInUserId(userId);
    };

    const getAllProfiles = (): UserProfileData[] =>{
        return MOCK_PROFILES;
    }
    
    const value: ProfileContextType = {
        getProfile,
        updateProfile,
        isLoggedInUser,
        loggedInUserId,
        setLoggedInUser,
        getAllProfiles,
    };
    
    return(
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile(): ProfileContextType{
    const context = useContext(ProfileContext);
    if(context === undefined){
        throw new Error('useProfile deve ser usado com um ProfileProvider');
    }
    return context;
}