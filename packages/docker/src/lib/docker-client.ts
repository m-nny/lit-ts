import Axios, { AxiosError } from 'axios';
import { CreateContainerArgs, CreateContainerResult } from './types/methods/create-container';
import { GetContainerLogsArgs, GetContainerLogsResult } from './types/methods/get-container-logs';
import { ListContainersArgs, ListContainersResult } from './types/methods/list-containers';
import { StartContainerArgs, StartContainerResult } from './types/methods/start-container';
import { WaitContainerArgs, WaitContainerResult } from './types/methods/wait-container';

export class DockerClient {
  private axios;
  public constructor() {
    this.axios = Axios.create({
      socketPath: `/var/run/docker.sock`,
    });
    this.axios.interceptors.response.use(
      (response) => {
        console.log(`[docker] response`, { response });
        return response;
      },
      (error: AxiosError) => {
        console.log(`[docker] error`, { response: error.response?.data, url: error.config.url });
        return Promise.reject(error);
      }
    );
  }
  public async listContainers(args: ListContainersArgs = {}): Promise<ListContainersResult> {
    const result = await this.axios.request<ListContainersResult>({
      method: 'GET',
      url: '/containers/json',
      params: args,
    });
    return result.data;
  }

  public async createContainer({ name, ...args }: CreateContainerArgs): Promise<CreateContainerResult> {
    const result = await this.axios.request<CreateContainerResult>({
      method: 'POST',
      url: '/containers/create',
      params: { name },
      data: args,
    });
    return result.data;
  }
  public async startContainer({ id }: StartContainerArgs): Promise<boolean> {
    const result = await this.axios.request<StartContainerResult>({
      method: 'POST',
      url: `/containers/${id}/start`,
    });
    return !!result.data;
  }
  public async waitContainer({ id }: WaitContainerArgs): Promise<WaitContainerResult> {
    const result = await this.axios.request<WaitContainerResult>({
      method: 'POST',
      url: `/containers/${id}/wait`,
    });
    return result.data;
  }
  public async getContainerLogs({ id, ...args }: GetContainerLogsArgs): Promise<GetContainerLogsResult> {
    const result = await this.axios.request<GetContainerLogsResult>({
      method: 'POST',
      url: `/containers/${id}/logs`,
      params: args,
    });
    return result.data;
  }
}
