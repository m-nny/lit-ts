import { DockerClient } from '@lit-ts/docker';

async function main() {
  const client = new DockerClient();

  const containers = await client.listContainers();
  console.log({ containers });

  const allContainers = await client.listContainers({ all: true, limit: 2 });
  console.log({ allContainers });
}
main();
