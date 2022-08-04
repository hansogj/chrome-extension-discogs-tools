import { base, colors } from '../popup/styled'
import { DEFAULT_HIGHLIGHTED_LABELS } from '../constants'
import { HightlightedLabels } from '../domain'
import find from './utils/find'
import {
  get as getStorage,
  remove as removeStorage,
  set as setStorage,
} from './storage'

const higlightColors = colors.highlightedLabels

const key = 'highlighted-labels'
export const generatedCss = (emphasize: string) => `repeating-linear-gradient(
    135deg,
    ${emphasize},
    ${higlightColors.white.strong} calc(${base} * 7),
    transparent ${base},
    transparent 99.999999%
  )`
const labelAlert = (selector: string, labels: string[], emphasize: string) =>
  find(selector)
    .map((listItem) => listItem as HTMLElement)
    .filter((listItem) =>
      labels.some((label) =>
        listItem.innerText.toLowerCase().match(label.toLowerCase()),
      ),
    )
    .map((match) => {
      match.style.backgroundImage = generatedCss(emphasize)
      return match
    })

const apply = ({ poor, fair, good, veryGood }: HightlightedLabels) => {
  ;['.label_and_cat', '.collection-row', 'tr[class^="wantlist"]'].forEach(
    (selector) => {
      labelAlert(selector, poor, higlightColors.red.strong)
      labelAlert(selector, fair, higlightColors.red.soft)
      labelAlert(selector, good, higlightColors.green.soft)
      labelAlert(selector, veryGood, higlightColors.green.strong)
    },
  )
}

const highlightedLabelsServcie = () => {
  const get = () => getStorage(key, DEFAULT_HIGHLIGHTED_LABELS)
  const remove = () => removeStorage(key)

  get().then(apply)

  return {
    get,
    set: (labels: HightlightedLabels) => {
      return labels
        ? get()
            .then((storedLabels: HightlightedLabels) => {
              return {
                ...storedLabels,
                ...labels,
              }
            })
            .then((it) => setStorage(key, it))
        : remove()
    },
  }
}

export default highlightedLabelsServcie
