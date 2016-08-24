import React from 'react';
import errorMessages from '../../common/auth/errorMessages';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { apiMessages } from '../../common/lib/redux-api';

class SignInError extends React.Component {

  static propTypes = {
    error: React.PropTypes.instanceOf(Error),
  };

  render() {
    const { error } = this.props;
    if (!error) return null;
    const message =
      errorMessages[error.name] ||
      apiMessages[error.name];

    return (
      <p className="signin-error">
        {message ?
          <FormattedMessage {...message} values={error.params} />
        :
          error.toString()
        }
      </p>
    );
  }

}

export default connect(state => ({
  error: state.auth.error,
}))(SignInError);
