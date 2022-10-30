// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// setup file

import '@testing-library/jest-dom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import fetchMock from 'jest-fetch-mock';

configure({ adapter: new Adapter() });

// @ts-ignore
global.fetch = fetchMock;
