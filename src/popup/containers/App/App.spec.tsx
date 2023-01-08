import { mockModuleWithProps } from '../../../_mock_';
import { App } from './App';

import { AsyncData } from '@swan-io/boxed';
import { shallow } from 'enzyme';
import { asyncOk } from '../../../services/redux/domain';
import {
  Header,
  Loader,
  Notification as NotificationComponent,
  TokenInput,
} from '../../components/App';
import { AppProps } from './types';

jest
  .mock('../../components/App/Loader', () => mockModuleWithProps())
  .mock('../../../services/storage', () => ({
    __esModule: true,
    default: () => {},
  }));

describe('App', () => {
  let props: AppProps = {} as AppProps;
  const setUp = (pProps = {}) => (props = { ...props, ...pProps });
  const wrapper = () => shallow(<App {...{ ...props }} />);

  describe('isLoading', () => {
    beforeEach(() => setUp({ user: AsyncData.Loading() }));
    it('renders Loader', () => expect(wrapper().find(Loader).length).toBe(1));

    it('renders no TokenInput', () => expect(wrapper().find(TokenInput).length).toBe(0));

    it('renders user content', () => expect(wrapper().find('[data-test]').length).toBe(0));
  });

  describe('notAuthenticated', () => {
    beforeEach(() => setUp({ user: AsyncData.NotAsked() }));

    it('renders TokenInput Component', () => expect(wrapper().find(TokenInput).length).toBe(1));

    it('renders no Loader Component', () => expect(wrapper().find(Loader).length).toBe(0));

    it('renders no main component', () =>
      expect(wrapper().find('[data-test-main-content]').length).toBe(0));
  });

  describe('has user', () => {
    beforeEach(() => setUp({ user: asyncOk({}) }));

    it('renders TokenInput Component', () => expect(wrapper().find(TokenInput).length).toBe(0));

    it('renders no Loader Component', () => expect(wrapper().find(Loader).length).toBe(0));

    it('renders main content', () =>
      expect(wrapper().find('[data-test-main-content]').length).toBe(1));

    it('renders Header component', () => {
      expect(wrapper().find(Header).length).toBe(1);
      expect(wrapper().find(Header).props()).toEqual({ user: {} });
    });

    describe('has notification', () => {
      beforeEach(() => setUp({ user: asyncOk({}), notification: 'HELP' }));
      it('renders Notification Component', () => {
        expect(wrapper().find(NotificationComponent).length).toBe(1);
        expect(wrapper().find(NotificationComponent).props()).toEqual({
          notification: 'HELP',
          refObject: expect.any(Object),
        });
      });
    });
  });
});
