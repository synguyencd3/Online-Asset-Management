export type PageableModel = {
    page: number;
    size: number;
    sort: string;
}

export type SearchPageableModel = {
    search: string;
    page: number;
    size: number;
    sort: string;
}

export type RequestPageableModel = {
    [key: string]: string | Array<string> | number;
    search: string,
    states: string[];
    returnedDate: string,
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
