import React from 'react';
import { App, AppProps } from './App';

import { shallow, mount, render } from 'enzyme';
import Loader from './Loader';
import TokenInput from './TokenInput';
import NotificationComponent from './Notification';
import Header from './Header';
jest.mock('../View', () => ({
  __esModule: true,
  default: () => <div>View</div>,
}));
describe('App', () => {
  let props: AppProps = {} as AppProps;
  const setUp = (pProps = {}) => (props = { ...props, ...pProps });
  const wrapper = () => shallow(<App {...{ ...props }} />);

  describe('isLoading', () => {
    beforeEach(() => setUp({ isLoading: true }));
    it('renders Loader', () => expect(wrapper().find(Loader).length).toBe(1));

    it('renders no TokenInput', () => expect(wrapper().find(TokenInput).length).toBe(0));

    it('renders user content', () => expect(wrapper().find('[data-test]').length).toBe(0));
  });

  describe('notAuthenticated', () => {
    beforeEach(() => setUp({ isLoading: false, notAuthenticated: true }));

    it('renders TokenInput Component', () => expect(wrapper().find(TokenInput).length).toBe(1));

    it('renders no Loader Component', () => expect(wrapper().find(Loader).length).toBe(0));

    it('renders no main component', () =>
      expect(wrapper().find('[data-test-main-content]').length).toBe(0));
  });

  describe('has user', () => {
    beforeEach(() => setUp({ isLoading: false, notAuthenticated: false, user: {} }));

    it('renders TokenInput Component', () => expect(wrapper().find(TokenInput).length).toBe(0));

    it('renders no Loader Component', () => expect(wrapper().find(Loader).length).toBe(0));

    it('renders main content', () =>
      expect(wrapper().find('[data-test-main-content]').length).toBe(1));

    it('renders Header component', () => {
      expect(wrapper().find(Header).length).toBe(1);
      expect(wrapper().find(Header).props()).toEqual({ user: {} });
    });

    describe('has notification', () => {
      beforeEach(() =>
        setUp({ isLoading: false, notAuthenticated: false, user: {}, notification: 'HELP' }),
      );
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
