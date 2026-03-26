export interface ProjectCompDetailsContract {
  id: string; //Tornar id obrigatória
  totalReviewers: number;
  totalScore: number;
  competitionId: string;
  projectId: string;
  checked: boolean;
}
