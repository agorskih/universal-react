import fetch from 'isomorphic-fetch';

export default class ApiClient {
  constructor(json) {
    this.domain = json.domain;
    this._json = json;
  }

  createUserWithEmailAndPassword(email, password) {
    console.log(`email=${email}`);
    console.log(`pass=${password}`);
    return Promise.resolve();
  }

  FacebookAuthProvider() {
    console.log('facebookauthprovider');
    return 'facebook';
  }

        /*
        await api.sendPasswordResetEmail(email);
    api.getRedirectResult().then(result => {
    api.onAuthStateChanged(apiUser => {
    api.child('.info/connected').on('value', snap => {
      const online = snap.val();
      */

  signInWithEmailAndPassword(email, password) {
    console.log(`email=${email}`);
    console.log(`pass=${password}`);
    return Promise.resolve();
  }

  signInWithRedirect(provider) {
    console.log(`provider=${provider}`);
    return Promise.resolve();
  }

  signInWithPopup(provider) {
    console.log(`provider=${provider}`);
    return Promise.resolve();
  }

  update(json) {
    /* { [`users/${user.id}`]: json,
    [`users-emails/${user.id}`]: { email }, }
    */
    console.log(`json=${json}`);
    return Promise.resolve();
  }
}
