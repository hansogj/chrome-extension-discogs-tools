import find from './util/find';

/* 
Filters out multiple instances of same item from wantlist
*/

export const uniqueRelease = () => {
  const colums = find('.release_list_table tbody tr');
  const releasePattern = /[(master)|(release)]\/(\d+)/;

  const getReleaseLinks = (release) =>
    find('.release_title_link a', release).filter(
      (a: any) => a.href.match(releasePattern).length
    );

  const getReleaseId = (releaseLink) =>
    releaseLink.href.match(/[(master)|(release)]\/(\d+)/).pop();

  const getArtist = (release) => {
    find('.release_title.set_height a', release)
      .filter((a, i) => i === 0)
      .map((a: any) => a.innerText)
      .pop();
  };

  const buildModel = (all, release) => {
    return getReleaseLinks(release)
      .map((link: any) => ({
        artist: getArtist(release),
        title: link.innerText,
        id: getReleaseId(link),
        rel: release,
      }))
      .shift();
  };

  const uniqueRelease = (release, index, list) => {
    const comparator = (_release, _index) =>
      release.title.toLowerCase() === _release.title.toLowerCase() &&
      index < _index;

    return list.filter(comparator).length;
  };

  const hide = (elem) => elem.classList.add('hidden');

  const addCss = () => {
    const css =
        'tr {display:table-row; transition: all .2s ease-out; }' +
        '.hidden {display:none;}',
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

  const hidden = colums
    .map(buildModel.bind(this, colums))
    .filter(uniqueRelease)
    .map((rel: any) => {
      hide(rel.rel);
      return rel;
    });

  console.log(hidden.map((rel) => rel.artist + ': ' + rel.title));
};
