export const shape = (obj: any) => JSON.stringify(obj, null, 0);

const mockProps: Record<string, any> = {};
export const mockComponentWithProps = ({ ...props }: any) => {
  mockProps[props['data-testid']] = props;
  return <div data-testid={props['data-testid']} />;
};
export const mockModuleWithProps = (component = 'default', props?: any) => ({
  __esModule: true,
  [component]: mockComponentWithProps,
  ...props,
});
export const getProps = (container: Element) =>
  mockProps[container.getAttribute('data-testid') as any];
