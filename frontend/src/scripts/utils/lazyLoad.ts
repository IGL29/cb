export async function lazyLoad<T>(dynamicModule: any): Promise<T> {
  const nameSpaceModule: { [key: string | 'default']: T } = await dynamicModule;
  if (nameSpaceModule.default) {
    return nameSpaceModule.default;
  }
  const module: T = Object.values(nameSpaceModule)[0];
  return module;
}
