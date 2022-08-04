import highlightedLabelsService from '../../highlighted.labels.service'
import { ActionTypes } from '../../redux'
import fieldsService from '../../selectedFields.service'
import versionsService from '../../versions.service'
import wantListService from '../../wantlist.service'
import { messageResolverFactory as backgroundMessageResolver } from '.././background.resolver'
import { messageResolverFactory as contentMessageResolver } from '.././content.resolver'
import { MessageResover } from '.././types'

console.log('message handler fallback')

const singlePageAppResolver =
  (
    action: ActionTypes,
    override: Partial<ActionTypes>,
  ): ((resolverMethod: MessageResover) => unknown) =>
  (resolverMethod) =>
    resolverMethod(
      { ...action, ...override } as ActionTypes,
      (prom: Promise<unknown>) =>
        prom
          .then((e) => Promise.resolve(e))
          .catch((error) => Promise.reject({ error })),
    )

export const messageHandlerFallback = (
  action: ActionTypes,
  override: Partial<ActionTypes> = {},
) => {
  const sapResolver = singlePageAppResolver(action, override)

  return Promise.race([
    sapResolver(
      contentMessageResolver({
        wantList: wantListService(),
        fields: fieldsService(),
        versions: versionsService(),
        highlightedLabels: highlightedLabelsService(),
      } as any),
    ),
    sapResolver(backgroundMessageResolver()),
  ])
}
