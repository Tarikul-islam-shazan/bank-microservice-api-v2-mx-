export interface InvexResponseData {
  busqueda: InvexResponse[];
  codRet: string;
  msgRet: string;
}

export interface InvexResponse {
  respcode: string;
  resptext: string;
  [key: string]: any;
}
