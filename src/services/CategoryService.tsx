import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { CategoryCreateModel} from "../models/CategoryModel";

export const categoriesEndpoint = `${AZURE_SERVICE_API}/categories`;

export const getCategories = async () => await axios.get(categoriesEndpoint, CORS_CONFIG);

export const createCategories = async (data: CategoryCreateModel) => await axios.post(categoriesEndpoint, data, CORS_CONFIG);