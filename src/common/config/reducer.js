import { Record } from '../transit';

const State = Record({
  appName: '',
  appVersion: '',
  api: '',
  sentryUrl: '',
}, 'config');

export default function configReducer(state = new State) {
  return state;
}
