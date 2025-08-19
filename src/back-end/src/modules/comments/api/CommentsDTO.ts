export interface CreateUserDTO {
  content: string;
  userId: string;
  projectId: string;
}

export interface UpdateUserDTO {
  id: string;
  content: string;
  userId: string;
}
