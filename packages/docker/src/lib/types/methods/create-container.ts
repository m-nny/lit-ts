export type CreateContainerArgs = {
  name?: string;
  Image: string;
  Cmd?: string[];
};
export type CreateContainerResult = {
  Id: string;
  Warnings: string[];
};
