import { DockerClient } from '@lit-ts/docker';

async function main() {
  const client = new DockerClient();

  const container = await client.createContainer({ Image: 'hello-world' });
  console.log({ container });

  const started = await client.startContainer({ id: container.Id });
  console.log({ started });

  const result = await client.waitContainer({ id: container.Id });
  console.log({ result });

  const logs = await client.getContainerLogs({ id: container.Id, stdout: true });
  console.log({ logs });
}
main();
