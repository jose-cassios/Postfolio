// Reutilizamos a interface de paginação já definida
export interface ResponsePagination {
  next_cursor: string | null;
  has_next_page: boolean;
  previous_cursor?: string;
  page_size?: number;
  total_items?: number;
}

// Criamos uma interface genérica para as respostas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  pagination: ResponsePagination;
}
