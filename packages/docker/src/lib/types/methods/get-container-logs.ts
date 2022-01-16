export type GetContainerLogsArgs = {
  id: string;
  follow?: boolean;
  stdout?: boolean;
  stderr?: boolean;
  since?: number;
  until?: number;
  timestamps?: boolean;
  tail?: 'all' | number;
};
export type GetContainerLogsResult = string;
