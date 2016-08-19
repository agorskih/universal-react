import Helmet from 'react-helmet';
import React, { Component } from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage } from 'react-intl';

export default class HomePage extends Component {

  render() {
    return (
      <div className="home-page">
        <FormattedMessage {...linksMessages.home}>
          {message =>
            <Helmet title={message} />
          }
        </FormattedMessage>
        <p>
          <a href="https://github.com/este/este">github.com/este/este</a>
        </p>
        <img alt="50x50 placeholder" src={require('./50x50.png')} />
      </div>
    );
  }

}
