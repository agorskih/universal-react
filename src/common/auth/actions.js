/* @flow weak */
export const SIGN_OUT = 'SIGN_OUT';

export const signOut = () => ({ api }) => {
  api.signOut();
  return {
    type: SIGN_OUT,
  };
};
