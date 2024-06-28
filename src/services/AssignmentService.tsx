import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";

export const getAssignmentsDetails = () => axios.get(`${AZURE_SERVICE_API}/assignments/own`, CORS_CONFIG);