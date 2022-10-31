import { stdDelay, getDelay, reset, sleep } from './call.stack';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

const _01012020 = 1577836800000;
const mockDate = (millis = 0) => (Date.now = jest.fn(() => _01012020 + millis));

describe('call.stack', () => {
  beforeEach(() => (console.log = jest.fn()));
  describe('getDelay', () => {
    describe.each([
      [1, stdDelay],
      [2, stdDelay],

      [3, stdDelay],
      [10, stdDelay],
      [57, stdDelay],
      [58, stdDelay],
      [59, 60400],
      [117, 500],
      [118, 43300],
      [119, 500],

      [2, stdDelay, [0, 4000]],
      [59, 52400, [58, 8000]],
      [59, stdDelay, [58, 60400]],
      [59, stdDelay * 2, [58, 60000]],
      [118, 43300, [58, 8000]],
      [118, 500, [58, 60400]],
    ] as Array<[number, number, number[]?]>)(
      'when %s th call to server',
      (nthCall, expected, [onCallIndex, extraDelayOnCall] = []) => {
        let delays: number[];
        let itPlus = extraDelayOnCall
          ? `
         and there is a ${extraDelayOnCall} seconds delay on call ${onCallIndex}
         `
          : '';
        beforeEach(() => {
          reset();
          delays = Array.from(Array(nthCall).keys()).reduce((curr, _, index) => {
            const timeSpent = curr.reduce((a, b) => a + b, 0);
            const extraDelay = index >= onCallIndex ? extraDelayOnCall : 0;

            mockDate(timeSpent + extraDelay);
            return [...curr, getDelay()];
          }, [] as number[]);
        });

        it(`${itPlus} last call should have a ${expected} seconds delay`, () =>
          expect(delays[delays.length - 1]).toBe(expected));
      },
    );
  });

  describe('sleep', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());
    it(`halts by default ${stdDelay} before progressing`, () => {
      sleep('/before/running1', stdDelay);
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), stdDelay);
    });

    it(`fires the callback after ${stdDelay} second`, () => {
      const callback = jest.fn();
      expect.assertions(3);

      // eslint-disable-next-line jest/valid-expect-in-promise
      sleep('/before/running2', stdDelay)
        .then(callback)
        .then(() => {
          expect(callback).toBeCalled();
          expect(callback).toHaveBeenCalledTimes(1);
        });

      expect(callback).not.toBeCalled();
      jest.runAllTimers();
    });
  });
});
