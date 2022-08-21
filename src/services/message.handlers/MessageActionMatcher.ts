import { API_TIMEOUT } from '../../constants';
import { ActionTypes } from '../redux';
import { MessageActions, MessageActionTypes } from './types';
export class MessageActionMatcher {
  action: ActionTypes;
  match?: (_action: MessageActionTypes) => Promise<unknown>;
  handler: string;

  constructor(action: ActionTypes, handler: string) {
    this.action = action;
    this.handler = handler;
  }
  matcher(message: MessageActions, cb: (action: MessageActionTypes) => Promise<unknown>) {
    this.match = message === this.action.type ? cb : this.match;
    return this;
  }

  resolve() {
    return Boolean(this.match)
      ? this.match!(this.action as MessageActionTypes)
      : new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `action ${this.action.type} not resolved in ${this.handler} message handler`,
                ),
              ),
            API_TIMEOUT,
          ),
        );
  }
}
