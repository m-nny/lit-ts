import { Container } from '../common/container';

export type ListContainersArgs = {
  all?: boolean;
  limit?: number;
  size?: boolean;
  // filters?: string;
};
export type ListContainersResult = Container[];
