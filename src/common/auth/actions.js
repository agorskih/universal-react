import { ValidationError } from '../lib/validation';

export const SIGN_IN_ERROR = 'SIGN_IN_ERROR';
export const SIGN_IN_START = 'SIGN_IN_START';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_OUT = 'SIGN_OUT';

export function signin(fields) {
  return ({ api, validate }) => {
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
}

export function signOut() {
  return ({ apiAuth }) => {
    apiAuth().signOut();
    return {
      type: SIGN_OUT,
    };
  };
}
