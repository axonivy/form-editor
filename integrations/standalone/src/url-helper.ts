export function parameter(key: string): string | undefined {
  const param = new URLSearchParams(window.location.search).get(key);
  return param !== null ? decodeURIComponent(param) : undefined;
}

export function appParam(): string {
  return parameter('app') ?? '';
}

export function projectParam(): string {
  return parameter('project') ?? '';
}

export function fileParam(): string {
  return parameter('file') ?? '';
}

export function directSaveParam(): boolean {
  return parameter('directSave') !== undefined;
}

export function themeParam(): 'dark' | 'light' {
  const theme = parameter('theme');
  if (theme === 'dark') {
    return theme;
  }
  return 'light';
}

export function readonlyParam(): boolean {
  const readonly = parameter('readonly');
  if (readonly === 'true') {
    return true;
  }
  return false;
}

export function webSocketBase(): string {
  return `${isSecureConnection() ? 'wss' : 'ws'}://${server()}`;
}

const isSecureConnection = () => {
  const secureParam = parameter('secure');
  if (secureParam === 'true') {
    return true;
  }
  if (secureParam === 'false') {
    return false;
  }
  return window.location.protocol === 'https:';
};

const server = () => {
  return parameter('server') ?? basePath();
};

const basePath = () => {
  return 'localhost:8081';
};
