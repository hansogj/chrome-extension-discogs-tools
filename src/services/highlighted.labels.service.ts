import { DEFAULT_HIGHLIGHTED_LABELS } from '../constants';
import { HighlightedLabels } from '../domain';
import { base, discogsColors } from '../popup/styled';
import { get as getStorage, remove as removeStorage, set as setStorage } from './storage';
import find from './utils/find';

const highlightColors = discogsColors.highlightedLabels;

const key = 'highlighted-labels';
export const generatedCss = (emphasize: string) => `repeating-linear-gradient(
    135deg,
    ${emphasize},
    ${highlightColors.white.strong}0 calc(${base} * 7),
    transparent ${base},
    transparent 99.999999%
  )`;
const labelAlert = (selector: string, labels: string[], emphasize: string) =>
  find(selector)
    .map((listItem) => listItem as HTMLElement)
    .filter((listItem) =>
      labels.some((label) => listItem.innerText.toLowerCase().match(label.toLowerCase())),
    )
    .map((match) => {
      match.style.backgroundImage = generatedCss(emphasize);
      return match;
    });

export const apply = () =>
  get().then(({ poor, fair, good, veryGood }: HighlightedLabels) =>
    ['.label_and_cat', '.collection-row', 'tr[class^="wantlist"]'].forEach((selector) => {
      labelAlert(selector, poor, highlightColors.red.strong);
      labelAlert(selector, fair, highlightColors.red.soft);
      labelAlert(selector, good, highlightColors.green.soft);
      labelAlert(selector, veryGood, highlightColors.green.strong);
    }),
  );

export const get = () => getStorage(key, DEFAULT_HIGHLIGHTED_LABELS);
export const remove = () => removeStorage(key);

export const set = (labels: HighlightedLabels) => {
  return labels
    ? get()
        .then((storedLabels: HighlightedLabels) => {
          return {
            ...storedLabels,
            ...labels,
          };
        })
        .then((it) => setStorage(key, it))
    : remove();
};
