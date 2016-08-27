/* @flow */
import fetch from 'isomorphic-fetch';
import invariant from 'invariant';
import mapApiUserToAppUser from './mapApiUserToAppUser';
import messages from './messages';
import { APP_OFFLINE, APP_ONLINE } from '../../app/actions';
import { ValidationError } from '../validation';
import { replace } from 'react-router-redux';
import { selectTab } from '../../../native/routing/actions';

export const API_OFF_QUERY = 'API_OFF_QUERY';
export const API_ON_AUTH = 'API_ON_AUTH';
export const API_ON_PERMISSION_DENIED = 'API_ON_PERMISSION_DENIED';
export const API_ON_QUERY = 'API_ON_QUERY';
export const API_RESET_PASSWORD_ERROR = 'API_RESET_PASSWORD_ERROR';
export const API_RESET_PASSWORD_START = 'API_RESET_PASSWORD_START';
export const API_RESET_PASSWORD_SUCCESS = 'API_RESET_PASSWORD_SUCCESS';
export const API_SAVE_USER_ERROR = 'API_SAVE_USER_ERROR';
export const API_SAVE_USER_START = 'API_SAVE_USER_START';
export const API_SAVE_USER_SUCCESS = 'API_SAVE_USER_SUCCESS';
export const API_SIGN_IN_ERROR = 'API_SIGN_IN_ERROR';
export const API_SIGN_IN_START = 'API_SIGN_IN_START';
export const API_SIGN_IN_SUCCESS = 'API_SIGN_IN_SUCCESS';
export const API_SIGN_UP_ERROR = 'API_SIGN_UP_ERROR';
export const API_SIGN_UP_START = 'API_SIGN_UP_START';
export const API_SIGN_UP_SUCCESS = 'API_SIGN_UP_SUCCESS';
export const API_START = 'API_START';

const facebookPermissions = [
  'email',
  'public_profile',
  'user_friends',
];

const validateEmailAndPassword = (validate, fields) => validate(fields)
  .prop('email')
    .required()
    .email()
  .prop('password')
    .required()
    .simplePassword()
  .promise;

const mapApiErrorToAppValidationError = code => {
  const prop = {
    'auth/email-already-in-use': 'email',
    'auth/invalid-email': 'email',
    'auth/user-not-found': 'email',
    'auth/wrong-password': 'password',
  }[code];
  return new ValidationError(code, { prop });
};

const emailSignIn = async (api, validate, { email, password }) => {
  await validateEmailAndPassword(validate, { email, password });
  try {
    return await api.signInEmailPassword(email, password);
  } catch (error) {
    if (messages[error.code]) {
      throw mapApiErrorToAppValidationError(error.code);
    }
    throw error;
  }
};
/*
export const oldSignIn = (fields: Object) => {
  return ({ api, validate }: any) => {
    const getPromise = async () => {
      try {
        // Validate fields async.
        await validate(fields)
          .prop('email')
            .required()
            .email()
          .prop('password')
            .required()
            .simplePassword()
          .promise;
        // Simulate response for server-less (Firebase hosting) example.
        if (process.env.IS_SERVERLESS) {
          return {
            email: fields.email,
            id: Date.now(),
          };
        }
        // Naive API fetch example.
        const response = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fields),
        });
        if (response.status !== 200) throw response;
        return response.json();
      } catch (error) {
        // HTTP status to ValidationError.
        if (error.status === 401) {
          throw new ValidationError('wrongPassword', { prop: 'password' });
        }
        throw error;
      }
    };

    return {
      type: 'SIGN_IN',
      payload: getPromise(),
    };
  };
};
*/

// stackoverflow.com/a/33997042/233902
const isFacebookApp = () => {
  const ua = navigator.userAgent || navigator.vendor; // eslint-disable-line no-undef
  return ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
};

const socialSignIn = async (api, providerName) => {
  invariant(providerName === 'spacebook',
   `${providerName} provider is not yet supported.`);
  // firebase.google.com/docs/auth/web/facebook-login
  const provider = new api.FacebookAuthProvider();
  provider.addScope(facebookPermissions.join(','));
  // github.com/steida/firebase/issues/15
  if (isFacebookApp()) {
    return await api.signInWithRedirect(provider);
  }
  try {
    return await api.signInWithPopup(provider);
  } catch (error) {
    if (error.code === 'auth/popup-blocked') {
      // TODO: https://github.com/steida/firebase/issues/15
      return await api.signInWithRedirect(provider);
    }
    throw error;
  }
};

const saveUser = user => ({ api }) => {
  // Strip email from user because it's saved in secured collection.
  const { email, ...json } = user.toJS();
  // With Firebase multi-path updates, we can update values at multiple
  // locations at the same time atomically.
  const promise = api.update({
    [`users/${user.id}`]: json,
    [`users-emails/${user.id}`]: { email },
  });
  return {
    type: 'API_SAVE_USER',
    payload: promise,
  };
};

const onAuth = user => ({ dispatch, getState }) => {
  if (user) {
    // Save user after successful auth to possible update its profile data.
    dispatch(saveUser(user));
  } else if (getState().users.viewer) {
    // Redirect to home page before sign out to ensure a valid view state.
    const action = getState().device.isReactNative
      ? selectTab('home')
      : replace('/');
    dispatch(action);
  }
  return {
    type: API_ON_AUTH,
    payload: { user },
  };
};

/*
// firebase.google.com/docs/database/web/offline-capabilities#section-sample
const createPresenceMonitor = () => {
  let connections = [];
  let off = null;

  return (firebase, firebaseDatabase, user) => {
    if (!user) {
      connections.forEach(connection => connection.remove());
      connections = [];
      return;
    }
    const connectedRef = firebase.child('.info/connected');
    const handler = snap => {
      if (!snap.val()) return;
      const userWithoutEmail = user.toJS();
      delete userWithoutEmail.email;
      const connectionRef = firebase.child(`users-presence/${user.id}`)
        .push({
          authenticatedAt: firebaseDatabase.ServerValue.TIMESTAMP,
          user: userWithoutEmail,
        });
      connections.push(connectionRef);
      connectionRef.onDisconnect().remove();
    };
    if (off) off();
    off = () => connectedRef.off('value', handler);
    connectedRef.on('value', handler);
  };
};
*/

export const signIn = (providerName: string, fields: Object) =>
  ({ api, validate }: any) => {
    const promise = providerName === 'password'
      ? emailSignIn(api, validate, fields)
      : socialSignIn(api, providerName);
    return {
      type: 'API_SIGN_IN',
      payload: promise,
      meta: { providerName, fields },
    };
  };

export const nativeSignIn = (providerName: string) =>
  ({ FBSDK: { AccessToken, LoginManager }, api }: any) => {
    invariant(providerName === 'spacebook',
     `${providerName} provider is not yet supported in nativeSignIn.`);
    const getPromise = async () => {
      const result = await LoginManager.logInWithReadPermissions(facebookPermissions);
      if (result.isCancelled) {
        // Mimic Firebase error to have the same universal API.
        const error: any = new Error('auth/popup-closed-by-user');
        error.code = 'auth/popup-closed-by-user';
        throw error;
      }
      const { accessToken } = await AccessToken.getCurrentAccessToken();
      const facebookCredential = api.FacebookAuthProvider
        .credential(accessToken.toString());
      await api.signInWithCredential(facebookCredential);
    };
    return {
      type: 'API_SIGN_IN',
      payload: getPromise(),
    };
  };

export const signUp = (providerName: string, fields: Object) =>
  ({ api, validate }: any) => {
    const getPromise = async () => {
      invariant(providerName === 'password',
       `${providerName} provider is not supported.`);
      const { email, password } = fields;
      await validateEmailAndPassword(validate, { email, password });
      try {
        return await api.createUserWithEmailAndPassword(email, password);
      } catch (error) {
        if (messages[error.code]) {
          throw mapApiErrorToAppValidationError(error.code);
        }
        throw error;
      }
    };
    return {
      type: 'API_SIGN_UP',
      payload: getPromise(),
    };
  };

export const onPermissionDenied = (message: string) => ({
  type: API_ON_PERMISSION_DENIED,
  payload: { message },
});

export const resetPassword = (email: string, onSuccess: Function) =>
  ({ api, validate }: any) => {
    const getPromise = async () => {
      await validate({ email })
        .prop('email')
          .required()
          .email()
        .promise;
      try {
        await api.sendPasswordResetEmail(email);
      } catch (error) {
        if (messages[error.code]) {
          throw mapApiErrorToAppValidationError(error.code);
        }
        throw error;
      }
      if (onSuccess) onSuccess();
    };
    return {
      type: 'API_RESET_PASSWORD',
      payload: getPromise(),
    };
  };

export const apiStart = () => {
  // const monitorPresence = createPresenceMonitor();

  return (deps: any) => {
    const {
      dispatch,
      api,
      getState,
    } = deps;
    /*
    api.getRedirectResult().then(result => {
      if (!result.credential) return;
      dispatch({ type: API_SIGN_IN_SUCCESS, payload: result });
    }, error => {
      if (error.code === 'auth/operation-not-supported-in-this-environment') {
        return;
      }
      dispatch({ type: API_SIGN_IN_ERROR, payload: error });
    });

    api.onAuthStateChanged(apiUser => {
      const user = mapApiUserToAppUser(apiUser);
      // monitorPresence(api, firebaseDatabase, user);
      dispatch(onAuth(user));
    });

    api.child('.info/connected').on('value', snap => {
      const online = snap.val();
      if (getState().app.online === online) return;
      dispatch({ type: online ? APP_ONLINE : APP_OFFLINE });
    });
    */

    return {
      type: API_START,
    };
  };
};
