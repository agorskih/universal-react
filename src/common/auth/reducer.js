import * as actions from './actions';
import { Record } from '../transit';
import { apiActions } from '../lib/redux-api';

const State = Record({
  formDisabled: false,
  error: null,
  success: null, // To get accessToken, refreshToken, whatever.
}, 'auth');

export default function authReducer(state = new State, action) {
  switch (action.type) {

    case actions.SIGN_IN_START:
    case apiActions.API_RESET_PASSWORD_START:
    case apiActions.API_SIGN_IN_START:
    case apiActions.API_SIGN_UP_START: {
      return state
        .set('formDisabled', true);
    }

    case actions.SIGN_IN_ERROR:
    case apiActions.API_RESET_PASSWORD_ERROR:
    case apiActions.API_SIGN_IN_ERROR:
    case apiActions.API_SIGN_UP_ERROR: {
      return state
        .set('formDisabled', false)
        .set('error', action.payload);
    }

    case actions.SIGN_IN_SUCCESS:
    case apiActions.API_RESET_PASSWORD_SUCCESS:
    case apiActions.API_SIGN_IN_SUCCESS:
    case apiActions.API_SIGN_UP_SUCCESS: {
      return state
        .set('formDisabled', false)
        .set('error', null)
        .set('success', action.payload);
    }

  }

  return state;
}
