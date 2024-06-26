import axios from "axios";
import { CORS_CONFIG } from "../utils/Config";

export const getWithSWR = async (url: string) => await axios.get(url, CORS_CONFIG);
