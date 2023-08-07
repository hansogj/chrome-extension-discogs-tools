import maybe from '@hansogj/maybe';

let stack: number[] = [];
export const stdDelay = 200;
export const rateLimit = 60;
export const reset = () => (stack = []);

export const getDelay = () => {
  const timestamp = Date.now();
  stack.unshift(timestamp);
  let actualDelay = stack && stack.length > rateLimit ? 500 : stdDelay;
  return maybe(stack)
    .map((it) => it[rateLimit - 2])
    .nothingUnless(Boolean)
    .map((it) => timestamp - it)
    .nothingIf((it) => it < actualDelay)
    .map((it) => rateLimit * 1200 - it)
    .nothingIf((it) => it < actualDelay)
    .valueOr(actualDelay);
};

export const sleep = (resource: string, delay = getDelay()) =>
  new Promise<number>((resolve, reject) => setTimeout(() => resolve(delay), delay)).then((delay) =>
    console.log(`Calling ${resource} after ${delay} millis: ${Date.now()} `, {
      size: stack.length,
      last: maybe(stack)
        .map((it) => it[0])
        .map((it) => new Date(it))
        .map((it) => [it.getSeconds(), it.getMilliseconds()].join(':'))
        .valueOr('undef'),
      delay,
    }),
  );

export const rejection = (e: any) => {
  console.error(e);
  return Promise.reject({
    latest: stack[0],
    rateLimit: stack[rateLimit - 1],
  });
};
