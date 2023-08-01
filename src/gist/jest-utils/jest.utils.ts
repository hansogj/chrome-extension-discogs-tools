/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type MockedModule<T> = { [P in keyof T]?: jest.Mock };
type RequireMock<T> = { requireMock: (arg0: string) => MockedModule<T> };

export const MockUtil = <T>(jest: RequireMock<T>) => {
  const requireMock = (path: string) => jest.requireMock(path) as MockedModule<T>;

  const requireMocks = (...modules: string[]) =>
    modules.map(requireMock).reduce((comp, curr) => {
      const alreadyMockedMethods = Object.keys(comp)
        .filter((mockedMethod) => mockedMethod !== '__esModule')
        .filter((mockedMethod) => Object.keys(curr).includes(mockedMethod));

      if (alreadyMockedMethods.length) {
        throw new Error(
          `Attempting to mock method where mock already exist: ${alreadyMockedMethods.join(', ')}`,
        );
      }

      return { ...comp, ...curr };
    }, {} as MockedModule<T>);

  const map = <G>(...comps: string[]) => comps.map((comp) => requireMock(comp)) as any as G;

  return { requireMock, requireMocks, map };
};

export const renderer = (template: string): Element =>
  new DOMParser().parseFromString(template, 'text/html').body.childNodes[0] as Element;

export const might = (should: boolean) => `should${should ? '' : ' not'}`;

export const shouldIt = (description: string, condition: boolean) => {
  const tests = {
    then: (cb: jest.ProvidesCallback) => {
      if (condition) it(`${might(condition)} ${description}`, cb);
      return tests;
    },
    dont: (jestIt: jest.ProvidesCallback) => {
      if (!condition) it(`${might(condition)} ${description}`, jestIt);
      return tests;
    },
  };
  return tests;
};

export default MockUtil;
