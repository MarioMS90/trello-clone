import { once } from '@atlaskit/pragmatic-drag-and-drop/once';

/**
 * Returns `true` if a `Safari` browser.
 * Returns `true` if the browser is running on iOS (they are all Safari).
 * */
export const isSafari = once((): boolean => {
  // if (process.env.NODE_ENV === 'development') {
  //   return true;
  // }

  const { userAgent } = navigator;
  return userAgent.includes('AppleWebKit') && !userAgent.includes('Chrome');
});
