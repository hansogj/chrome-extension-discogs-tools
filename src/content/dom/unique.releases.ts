// import find from "find-js";

const find = (selector: string, root: Document | Element = window.document) =>
  Array.from(root.querySelectorAll(selector));

/* 
Filters out multiple instances of same item from wantlist
*/

export const uniqueRelease = () => {
  const columns = find('.release_list_table tbody tr');
  const releasePattern = /[(master)|(release)]\/(\d+)/;

  const getReleaseLinks = (release: HTMLElement | Document | undefined) =>
    find('.release_title_link a', release).filter((a: any) => a.href.match(releasePattern).length);

  const getReleaseId = (releaseLink: { href: { match: (arg0: RegExp) => any[] } }) =>
    releaseLink.href.match(/[(master)|(release)]\/(\d+)/).pop();

  const getArtist = (release: HTMLElement | Document | undefined) => {
    find('.release_title.set_height a', release)
      .filter((_, i) => i === 0)
      .map((a: any) => a.innerText)
      .pop();
  };

  const buildModel = (_: any, release: any) => {
    return getReleaseLinks(release)
      .map((link: any) => ({
        artist: getArtist(release),
        title: link.innerText,
        id: getReleaseId(link),
        rel: release,
      }))
      .shift();
  };

  const uniqueRelease = (
    release: { title: string },
    index: number,
    list: {
      filter: (arg0: (_release: any, _index: any) => boolean) => {
        (): any;
        new (): any;
        length: any;
      };
    },
  ) => {
    const comparator = (_release: { title: string }, _index: number) =>
      release.title.toLowerCase() === _release.title.toLowerCase() && index < _index;

    return list.filter(comparator).length;
  };

  const hide = (elem: { classList: { add: (arg0: string) => any } }) =>
    elem.classList.add('hidden');

  const addCss = () => {
    const css = `tr {display:table-row; transition: all .2s ease-out; }.hidden {display:none;}`,
      head = document.head || document.getElementsByTagName('head')[0],
      style: any = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  };

  addCss();

  const hidden = columns
    .map(buildModel.bind(this, columns))
    .filter(uniqueRelease as any)
    .map((rel: any) => {
      hide(rel.rel);
      return rel;
    });

  console.log(hidden.map((rel) => rel.artist + ': ' + rel.title));
};
