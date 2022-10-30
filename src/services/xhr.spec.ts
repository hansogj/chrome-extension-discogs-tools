import * as xhr from './xhr';

import { FetchMock } from 'jest-fetch-mock';
import { MockUtil, shouldIt } from '../../gist/jest-utils/jest.utils';
import * as userTokenService from './userToken.service';

const fetchMock = fetch as FetchMock;

jest.mock('./userToken.service').mock('./call.stack', () => ({
  __esModule: true,
  sleep: () => Promise.resolve(),
}));

const userTokenMock = MockUtil<typeof userTokenService>(jest).requireMocks('./userToken.service');

describe('xhr', () => {
  it('should have the shape of', () =>
    expect(Object.keys(xhr).sort()).toEqual(['deleteResource', 'get', 'post', 'put']));

  describe('accessors', () => {
    const baseRequest = {
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    };
    const url = '/url';
    beforeEach(() => {
      fetchMock.resetMocks();
      userTokenMock.get?.mockResolvedValue('USER_TOKEN');
    });

    describe.each([
      ['get', 'GET', false],
      ['post', 'POST', true],
      ['put', 'PUT', true],
      ['deleteResource', 'DELETE', true, true],
    ] as Array<[string, string, boolean, boolean]>)(
      'calling method xhr.%s',
      (calledFn, method, hasBodyPayload, noPayloadOrResponse) => {
        let result: any;

        const responseContent = { artist: 'Magma' };

        beforeEach(async () => {
          fetchMock.mockResponseOnce(JSON.stringify(responseContent));
          result = await xhr[calledFn](url);
        });

        it(`should get userToken`, () => expect(userTokenMock.get).toHaveBeenCalled());
        it(`should fetch resource`, () => expect(fetchMock).toHaveBeenCalled());

        if (!noPayloadOrResponse) {
          shouldIt('fetch resource with userToken and headers AND payloadBody', hasBodyPayload)
            .dont(() =>
              expect(fetchMock).toHaveBeenCalledWith(`${url}?token=USER_TOKEN`, {
                ...baseRequest,
                method,
              }),
            )
            .then(() =>
              expect(fetchMock).toHaveBeenCalledWith(`${url}?token=USER_TOKEN`, {
                ...baseRequest,
                method,
                body: '{}',
              }),
            );

          it(`return ${JSON.stringify(responseContent)}`, () =>
            expect(result).toEqual(responseContent));
        }
      },
    );
    const responseContent = {
      artist: 'Magma',
      album: 'Mekanïk Destruktïw Kommandöh',
    };

    describe.each([
      [undefined, `${url}?token=USER_TOKEN`],
      [{}, `${url}?token=USER_TOKEN`],
      [{ artist: 'Magma' }, `${url}?artist=Magma&token=USER_TOKEN`],
      [
        {
          artist: 'Magma',
          album: 'Mekanïk Destruktïw Kommandöh',
        },
        '/url?artist=Magma&album=Mekan%C3%AFk%20Destrukt%C3%AFw%20Kommand%C3%B6h&token=USER_TOKEN',
      ],
    ] as Array<[URLSearchParams, string]>)(`calling get(${url}, %j)`, (params, expectedUrl) => {
      beforeEach(async () => {
        fetchMock.mockResponseOnce(JSON.stringify(responseContent));
        await xhr.get(url, params);
      });
      it('appends search params to url, and adds no extra to payload', () =>
        expect(fetchMock).toHaveBeenCalledWith(expectedUrl, {
          ...baseRequest,
          method: 'GET',
        }));
    });

    describe(`calling deleteResource(${url})`, () => {
      beforeEach(async () => {
        fetchMock.mockResponseOnce(JSON.stringify(responseContent));
        await xhr.deleteResource(url);
      });
      it('appends search params to url, and adds no extra to payload', () =>
        expect(fetchMock).toHaveBeenCalledWith(url + '?token=USER_TOKEN', {
          method: 'DELETE',
        }));
    });

    describe.each([
      [undefined, '{}', `${url}?token=USER_TOKEN`],
      [{}, '{}', `${url}?token=USER_TOKEN`],
      [{ payLoad: { pl: 1 } }, '{"pl":1}', `${url}?token=USER_TOKEN`],
      [{ artist: 'Magma' }, '{}', `${url}?artist=Magma&token=USER_TOKEN`],
      [{ artist: 'Magma', payLoad: { pl: 1 } }, '{"pl":1}', `${url}?artist=Magma&token=USER_TOKEN`],
    ] as Array<[URLSearchParams, string, string]>)(
      `calling post(${url}, %j)`,
      (params, body, expectedUrl) => {
        beforeEach(async () => {
          fetchMock.mockResponseOnce(JSON.stringify(responseContent));
          await xhr.post(url, params);
        });
        it('appends search params to url, and adds extra payload as body option', () =>
          expect(fetchMock).toHaveBeenCalledWith(expectedUrl, {
            ...baseRequest,
            body,
            method: 'POST',
          }));
      },
    );

    describe.each([
      [undefined, '{}', `${url}?token=USER_TOKEN`],
      [{}, '{}', `${url}?token=USER_TOKEN`],
      [{ payLoad: { pl: 1 } }, '{"pl":1}', `${url}?token=USER_TOKEN`],
      [{ artist: 'Magma' }, '{}', `${url}?artist=Magma&token=USER_TOKEN`],
      [{ artist: 'Magma', payLoad: { pl: 1 } }, '{"pl":1}', `${url}?artist=Magma&token=USER_TOKEN`],
    ] as Array<[URLSearchParams, string, string]>)(
      `calling put(${url}, %j)`,
      (params, body, expectedUrl) => {
        beforeEach(async () => {
          fetchMock.mockResponseOnce(JSON.stringify(responseContent));
          await xhr.put(url, params);
        });
        it('appends search params to url, and adds extra payload as body option', () =>
          expect(fetchMock).toHaveBeenCalledWith(expectedUrl, {
            ...baseRequest,
            body,
            method: 'PUT',
          }));
      },
    );
  });
});
