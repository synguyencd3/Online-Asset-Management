import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { AssignmentCreateModel } from "../models/AssignmentModel";

export const getAssignments = async (params: string) => await axios.get(`${AZURE_SERVICE_API}/assignments` + params, CORS_CONFIG);
export const createAssignments = async (data: AssignmentCreateModel) => await axios.post(`${AZURE_SERVICE_API}/assignments`,data, CORS_CONFIG);

export const getAssignmentsDetails = () => axios.get(`${AZURE_SERVICE_API}/assignments/own`, CORS_CONFIG);
