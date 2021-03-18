import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <li><a href="/auth/google">Login With Google</a></li>;
      default:
        return <div><li><a href="/dashboard">Dashboard</a></li><li><a href="/api/logout">Logout</a></li></div>;
    }
  }

  render() {
    //console.log(this.props);
    return (
      <nav>
        <div className="nav-wrapper">
          <a className="left brand-logo" href="/">
            BetterLearn
          </a>
          <ul className="right">
            {this.renderContent()}
          </ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);