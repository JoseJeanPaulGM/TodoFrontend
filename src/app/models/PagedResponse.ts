// 1.3 Modelo de respuesta paginada 
export interface PagedResponse<T> {
    items: T[];          // Lista de elementos en la página actual
    pageNumber: number;  // Número de página actual
    pageSize: number;    // Cantidad de elementos por página
    totalPages: number;  // Número total de páginas
    totalCount: number;  // Cantidad total de elementos
    hasPrevious: boolean; // Si hay página anterior
    hasNext: boolean;    // Si hay página siguiente
  }