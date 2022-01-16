type ContainerPort = {
  PrivatePort: number;
  PublicPort: number;
  Type: string;
};
type NetworkSetting = {
  NetworkID: string;
  EndpointID: string;
  Gateway: string;
  IPAddress: string;
  IPPrefixLen: number;
  IPv6Gateway: string;
  GlobalIPv6Address: string;
  GlobalIPv6PrefixLen: number;
  MacAddress: string;
};
type ContainerMount = {
  Name: string;
  Source: string;
  Destination: string;
  Driver: string;
  Mode: string;
  RW: boolean;
  Propagation: string;
};
export type Container = {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  State: string;
  Status: string;
  Ports: ContainerPort[];
  Labels: Record<string, string>;
  SizeRw: number;
  SizeRootFs: number;
  HostConfig: {
    NetworkMode: string;
  };
  NetworkSettings: {
    Networks: Record<string, NetworkSetting>;
  };
  Mounts: ContainerMount[];
};
