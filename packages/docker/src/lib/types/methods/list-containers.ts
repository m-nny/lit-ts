import { Container } from '../common/container';

export type ListContainersuArgs = {
  all?: boolean;
  limit?: number;
  size?: boolean;
  // filters?: string;
};
export type ListContainersResult = Container[];
