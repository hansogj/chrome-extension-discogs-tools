import produce, { Draft } from "immer";
import maybe from "maybe-for-sure";

type Producer<State, Action> = (draft: Draft<State>, action: Action) => void;
type SharedKeys<Type, OtherType> = keyof Type & keyof OtherType;

export const passReducer = <T>(draft: Draft<T>): Draft<T> => draft;
/**
 * Combine producers mapping individual action types to a draft into a reducer.
 *
 * Avoids the boilerplate `produce`, `switch`, and `break` syntax.
 *
 * This is still fully type safe and enforces the draft pattern provided by immer.
 */
export const reducerForProducers =
  <
    State,
    Action extends { type: ActionType },
    ActionType extends string = Action["type"]
  >(
    initialState: State,
    producers: { [actionType in ActionType]?: Producer<State, Action> }
  ) =>
  (state: State = initialState, action: Action): State =>
    produce(state, (draft: Draft<State>) => {
      if (typeof producers[action.type] === "function") {
        // @ts-ignore
        producers[action.type](draft, action);
      }
    });

/**
 * Write the value for `action.key` to `draft.key`.
 *
 * Avoids the boilerplate arrow function syntac.
 */
export const writeToDraft =
  <
    State,
    Action extends Pick<Partial<Draft<State>>, Key> & { type: ActionType }, // This guarantees the types to be compatible, but the IDE doesn't catch it.
    Key extends SharedKeys<Draft<State>, Action>, // The key must be valid for both the action and the state/draft
    ActionType extends string = Action["type"]
  >(
    ...keys: Array<Key>
  ): Producer<State, Action> =>
  (draft: Draft<State>, action: Action) =>
    // eslint-disable-next-line
    keys.forEach((key) => (draft[key] = action[key] as any));

export const selectFromRoot = <T, Key extends keyof T>(
  state: T,
  select: Key
): T[Key] =>
  maybe(state)
    .mapTo(select)
    .valueOr(undefined as unknown as T[Key]);
