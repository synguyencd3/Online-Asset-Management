import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";

export const createReturnRequest = async (body: any) => await axios.post(`${AZURE_SERVICE_API}/return`,body, CORS_CONFIG);
