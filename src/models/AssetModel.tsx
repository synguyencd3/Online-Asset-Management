import { AssetState, Location } from "../utils/Enum";

export type AssetModel = {
    // id: number;
    assetCode: string;
    name: string;
    category: string;
    installedDate: Date;
    location: Location;
    specification: string;
    state: AssetState;
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
