import Gravatar from 'react-gravatar';
import React from 'react';
import { Loading } from '../app/components';
import { connect } from 'react-redux';
import { onUsersPresence } from '../../common/users/actions';
import { queryApi } from '../../common/lib/redux-api';

const styles = {
  user: {
    display: 'inline-block',
  },
  gravatar: {
    borderRadius: '25%',
    margin: '.5em',
    maxHeight: 50,
  },
};

const User = ({ user: { displayName, photoURL } }) =>
  <div style={styles.user}>
    {photoURL ?
      <img
        role="presentation"
        src={photoURL}
        style={styles.gravatar}
        title={displayName}
      />
    :
      <Gravatar
        default="retro"
        email={displayName} // For users signed in via email.
        https
        rating="x"
        style={styles.gravatar}
        title={displayName}
      />
    }
  </div>;

User.propTypes = {
  user: React.PropTypes.object.isRequired,
};

let OnlineUsers = ({ loaded, users }) => (
  <div className="online-users">
    {!loaded ?
      <Loading />
    : !users ?
      <p>No one is online.</p>
    :
      users.reverse().map(user =>
        <User key={user.id} user={user} />
      )
    }
  </div>
);

OnlineUsers.propTypes = {
  users: React.PropTypes.object,
  loaded: React.PropTypes.bool.isRequired,
};

OnlineUsers = queryApi(OnlineUsers, ({ onUsersPresence }) => ({
  path: 'users-presence',
  on: { value: onUsersPresence },
}));

export default connect(state => ({
  users: state.users.online,
  loaded: state.users.onlineLoaded,
}), { onUsersPresence })(OnlineUsers);
