import { Cache, omit, pick } from './wantlist.service';

jest
  .mock('./storage', () => ({
    __esModule: true,
    default: () => {},
  }))
  .mock('@vespaiach/axios-fetch-adapter', () => ({
    __esModule: true,
    default: () => {},
  }));

describe('wantlist service', () => {
  describe.each([
    [{}, {}, {}],
    [{ a: 1 }, {}, { a: 1 }],
    [{ a: 1 }, { a: 1 }, {}],
    [{ a: 1, b: 2 }, { a: 1 }, { b: 2 }],
  ] as Array<[Cache, Cache, Cache]>)('%p omit %p', (a, b, expected) => {
    it(`should be ${JSON.stringify(expected)}`, () => expect(omit(a, b)).toEqual(expected));
  });

  describe.each([
    [{}, {}, {}],
    [{ a: 1 }, {}, {}],
    [{ a: 1 }, { a: 2 }, { a: 1 }],
    [{ a: 1, b: 2 }, { a: 1 }, { a: 1 }],
  ] as Array<[Cache, Cache, Cache]>)('%p pick %p', (a, b, expected) => {
    it(`should be ${JSON.stringify(expected)}`, () => expect(pick(a, b)).toEqual(expected));
  });
});
