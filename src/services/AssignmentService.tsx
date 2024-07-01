import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
// import { AssignmentCreateModel } from "../models/AssignmentModel";
import { OwnPageableModel, PageableModel } from "../models/PageableModel";

// export const getAssignments = async (params: string) => await axios.get(`${AZURE_SERVICE_API}/assignments` + params, CORS_CONFIG);
// export const createAssignments = async (data: AssignmentCreateModel) => await axios.post(`${AZURE_SERVICE_API}/assignments`,data, CORS_CONFIG);

export const getOwnAssignmentDetails = (pageable: OwnPageableModel) => axios.get(`${AZURE_SERVICE_API}/assignments/own?searchpage=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`, CORS_CONFIG);
export const getAssignmentsDetails = (pageable: PageableModel) => axios.get(`${AZURE_SERVICE_API}/assignments?searchKey=${pageable.searchKey}&page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`, CORS_CONFIG);
export const responseAssignment = (id: number, status: string) => axios.patch(`${AZURE_SERVICE_API}/assignments/response/${id}?status=${status}`, null, CORS_CONFIG);
