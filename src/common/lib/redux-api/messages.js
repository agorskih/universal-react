
import { defineMessages } from 'react-intl';

// firebase.google.com/docs/reference/js/firebase.auth.Error
// Some errors are not translated, because they should not happen.
//  PERMISSION_DENIED - Probably app error so it should be reported.
//  auth/requires-recent-login - Should be handled in the code.

export default defineMessages({
  'auth/email-already-in-use': {
    defaultMessage: `The new user account cannot be created because the
      specified email address is already in use.`,
    id: 'api.error.EMAIL_TAKEN',
  },
  'auth/invalid-email': {
    defaultMessage: 'The specified email is not a valid email.',
    id: 'api.error.INVALID_EMAIL',
  },
  'auth/user-not-found': {
    defaultMessage: 'The specified user account does not exist.',
    id: 'api.error.INVALID_USER',
  },
  'auth/wrong-password': {
    defaultMessage: 'The specified user account password is incorrect.',
    id: 'api.error.INVALID_PASSWORD',
  },
  'auth/network-request-failed': {
    defaultMessage: 'No internet connection.',
    id: 'api.error.auth/network-request-failed',
  },
  'auth/too-many-requests': {
    defaultMessage: 'Too many requests. Try it later, please.',
    id: 'api.error.auth/too-many-requests',
  },
  'auth/user-token-expired': {
    defaultMessage: 'Your credential has expired. Please sign in.',
    id: 'api.error.auth/user-token-expired',
  },
});
