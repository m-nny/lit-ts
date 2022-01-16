export type WaitContainerArgs = {
  id: string;
};
export type WaitContainerResult = {
  StatusCode: number;
  Error?: {
    Message: string;
  };
};
