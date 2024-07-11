import { AssetState, Location } from "../utils/Enum";

export type AssetModel = {
  [key: string]: any; // Add an index signature to support dynamic property access
  assetCode: string;
  name: string;
  category: string;
  installedDate: Date;
  location: Location;
  specification: string;
  state: AssetState;
}

export type AssetParamModel = {
  search: string,
  states: string[],
  categories: string[] | undefined,
  page: number,
  size: number,
  sort: string,
}

export type AssetForTableModel = {
  assetCode: string,
  assetName: string,
  category: string,
  state: string;
}

export type AssetHistoryModel = {
  [key: string]: any; // Add an index signature to support dynamic property access
  date: Date;
  assignedTo: string;
  assignedBy: string;
  returnedDate: Date;
}

export type AssetCreateModel = {
  assetName: string;
  categoryName: string;
  specification: string;
  installDate: string;
  assetState: string;
};

export type AssetDetailModel = {
  assetCode: string;
  name: string;
  category: string;
  specification: string;
  installedDate: string;
  state: AssetState;
}

export type AssetEditRequestModel = {
  assetName: string;
  specification: string;
  installDate: string;
  assetState: string;
}

export type AssetForSelectTableModel = {
  assetCode: string,
  assetName: string,
  category: string,
}
