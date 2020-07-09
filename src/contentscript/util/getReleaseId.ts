export default (url: string = window.location.pathname) =>
  url.split('/release/').last().map(parseInt).pop();
