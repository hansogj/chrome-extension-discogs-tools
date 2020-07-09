import find from './util/find';
/* 
Filters out multiple instances of same seller from an items sales page
*/
const pathToItemTitle = ['.seller_info', 'li:first-child', 'a'];

const getCurrentSellerName = (sellerInfo: Element) =>
  find(pathToItemTitle.join(' '), sellerInfo)
    .map((thisItem: any) => thisItem.text)
    .shift();

export const uniqueSeller = () =>
  find('.shortcut_navigable')
    .flatMap((sellerInfo, _, listOfItems: HTMLElement[]) => {
      const sellerName = getCurrentSellerName(sellerInfo);
      return listOfItems
        .filter(
          (otherItem) =>
            (otherItem.querySelector(
              pathToItemTitle.slice(1).join(' ')
            ) as HTMLAnchorElement).text === sellerName
        )
        .splice(1);
    })
    .forEach((unique: HTMLElement) => (unique.style.display = 'none'));
