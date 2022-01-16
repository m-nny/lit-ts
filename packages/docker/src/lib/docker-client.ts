import Axios from 'axios';
import { ListContainersResult, ListContainersuArgs } from './types/methods/list-containers';

export class DockerClient {
  private axios;
  public constructor() {
    this.axios = Axios.create({
      socketPath: `/var/run/docker.sock`,
    });
  }
  public async listContainers(args: ListContainersuArgs): Promise<ListContainersResult> {
    const result = await this.axios.request<ListContainersResult>({
      method: 'GET',
      url: '/containers/json',
      params: args,
    });
    return result.data;
  }
}
