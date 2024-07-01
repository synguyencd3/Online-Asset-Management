export type OwnPageableModel = {
    page: number;
    size: number;
    sort: string;
}

export type PageableModel = {
    search: string;
    page: number;
    size: number;
    sort: string;
}

export interface PageResponseModel<T> {
    content: T[];
    totalPage: number;
    currentPage: number;
    totalElements: number;
  }
