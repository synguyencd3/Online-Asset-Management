import axios from "axios";
import { AZURE_SERVICE_API, CORS_CONFIG } from "../utils/Config";
import { AssignmentCreateModel } from "../models/AssignmentModel";
import {
  OwnPageableModel,
  PageResponseModel,
  PageableModel,
} from "../models/PageableModel";
import { AssignmentForTableModel } from "../models/AssignmentForTable";
import { AssignmentModalModel } from "../models/AssignmentModel";
import { uppercaseStatusToText } from "../utils/utils";

// export const getAssignments = async (params: string) => await axios.get(`${AZURE_SERVICE_API}/assignments` + params, CORS_CONFIG);
export const createAssignments = async (data: AssignmentCreateModel) => await axios.post(`${AZURE_SERVICE_API}/assignments`,data, CORS_CONFIG);

export const getOwnAssignmentDetails = (pageable: OwnPageableModel) =>
  axios.get(
    `${AZURE_SERVICE_API}/assignments/own?searchpage=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`,
    CORS_CONFIG
  );

export const getAssignmentsDetails = (pageable: PageableModel) =>
  axios.get(
    `${AZURE_SERVICE_API}/assignments?search=${pageable.search}&page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`,
    CORS_CONFIG
  );

export const responseAssignment = (id: number, status: string) =>
  axios.patch(
    `${AZURE_SERVICE_API}/assignments/response/${id}?status=${status}`,
    null,
    CORS_CONFIG
  );
export interface AssignmentGetParams {
  [key: string]: string | Array<string> | number;
  search: string;
  status: Array<string>;
  assignedDate: string;
  page: number;
  size: number;
  sort: string;
}

const toStringParams = (params: AssignmentGetParams) => {
  params = {
    ...params,
    status: params.status.map((status) =>
      status.toUpperCase().replace(/ /g, "_")
    ),
  };
  return Object.keys(params)
    .map((key) => {
      let value = params[key];
      if (Array.isArray(params[key])) {
        value = (params[key] as string[]).join(",");
      }
      return `${key}=${value}`;
    })
    .join("&");
};

export const getAssignmentsUrl = (params: AssignmentGetParams) => {
  const paramsStr = toStringParams(params);
  return `${AZURE_SERVICE_API}/assignments?${paramsStr}`;
};

export const getAssignments = async (url: string) => {
  const response = await axios.get(url, CORS_CONFIG);
  const pageAssignment: PageResponseModel<AssignmentForTableModel> = {
    content: [],
    totalPage: response.data.data.totalPage,
    currentPage: response.data.data.currentPage,
    totalElements: response.data.data.totalElements,
  };
  response.data.data.content.forEach((assignment: AssignmentModalModel) => {
    const item: AssignmentForTableModel = {
      id: assignment.id,
      assetCode: assignment.assetCode,
      assetName: assignment.assetName,
      assignedBy: assignment.assignedBy,
      assignedTo: assignment.assignedTo,
      assignedDate: assignment.assignedDate,
      status: uppercaseStatusToText(assignment.status),
    };
    pageAssignment.content.push(item);
  });
  return pageAssignment;
};

export const getOneAssignmentUrl = (id: number) => {
  return `${AZURE_SERVICE_API}/assignments/${id}`;
};

export const getOneAssignemnt = async (url: string) => {
  const response = await axios.get(url, CORS_CONFIG);
  const assignment: AssignmentModalModel = response.data.data;
  return assignment;

}

// export const getAssignments = async (params: string) => await axios.get(`${AZURE_SERVICE_API}/assignments` + params, CORS_CONFIG);
// export const createAssignments = async (data: AssignmentCreateModel) => await axios.post(`${AZURE_SERVICE_API}/assignments`,data, CORS_CONFIG);
// export const getAssignmentsDetails = () => axios.get(`${AZURE_SERVICE_API}/assignments/own`, CORS_CONFIG);
