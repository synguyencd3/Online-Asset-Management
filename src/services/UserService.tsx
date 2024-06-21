import axios from "axios";
import { LOCAL_SERVICE_API, CORS_CONFIG } from "../utils/Config";

export const disableUser = async (staffCode: string) => await axios.delete(`${LOCAL_SERVICE_API}/users/${staffCode}`, CORS_CONFIG);
