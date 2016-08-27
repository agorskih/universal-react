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

  async signInEmailPassword(email, password) {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (response.status !== 200) {
      throw await response.json();
    }
    return response.json();
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
