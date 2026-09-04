import path from 'node:path';

const workspaceName = 'form-test-project';
const user = 'Developer';

const requestHeaders = {
  'X-Requested-By': 'form-editor-tests',
  'Content-Type': 'application/json',
  Authorization: `Basic ${Buffer.from(`${user}:${user}`).toString('base64')}`
};

const apiUrl = (engineUrl: string, resource: string) => `${engineUrl.replace(/\/?$/, '/')}designer/api/web-ide/${resource}`;

const createWorkspace = async (engineUrl: string, workspacePath: string) => {
  const response = await fetch(apiUrl(engineUrl, 'workspace'), {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({ name: workspaceName, path: workspacePath })
  });

  if (!response.ok) {
    throw new Error(`Failed to create workspace '${workspaceName}': ${response.status} ${await response.text()}`);
  }

  const workspace: unknown = await response.json();
  if (typeof workspace !== 'object' || workspace === null || !('id' in workspace) || typeof workspace.id !== 'string') {
    throw new Error(`Workspace creation returned an invalid response for '${workspaceName}'`);
  }
  console.info(`Created workspace '${workspaceName}' (${workspace.id}) [${response.status}]`);
  return workspace.id;
};

const createProject = async (engineUrl: string, workspaceId: string, projectPath: string) => {
  const projectResponse = await fetch(apiUrl(engineUrl, 'project'), {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({ workspaceId, name: workspaceName, path: projectPath })
  });

  if (!projectResponse.ok) {
    throw new Error(`Failed to find or create project '${workspaceName}': ${projectResponse.status} ${await projectResponse.text()}`);
  }
  console.info(`Found or created project '${workspaceName}' [${projectResponse.status}]`);
};

const deployProjects = async (engineUrl: string, workspaceId: string, projectPath: string) => {
  const deployResponse = await fetch(apiUrl(engineUrl, 'projects/deployProjects'), {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({ workspaceId, projectDirs: [projectPath] })
  });

  if (!deployResponse.ok) {
    throw new Error(`Failed to deploy project '${projectPath}': ${deployResponse.status} ${await deployResponse.text()}`);
  }
  console.info(`Deployed project '${projectPath}' [${deployResponse.status}]`);
};

const setup = async () => {
  const engineUrl = process.env.BASE_URL ?? 'http://localhost:8080';
  const workspacePath = path.resolve(import.meta.dirname, '..');
  console.info(`Setting up workspace '${workspaceName}' in '${workspacePath}'`);
  const workspaceId = await createWorkspace(engineUrl, workspacePath);
  const projectPath = path.join(workspacePath, workspaceName);
  await createProject(engineUrl, workspaceId, projectPath);
  await deployProjects(engineUrl, workspaceId, projectPath);
};

export default setup;
