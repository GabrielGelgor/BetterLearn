import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

//checks state of user (whether ther logged in or not) and acts accordingly
class UserInfo extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <p> Please <a href="/auth/google">Login </a>to view UserInfo</p>;

      //if logged in render/return the following
      //Muhammed put your code here
      default:
        return <div>
        
            <h2>UserInfo:</h2>
            <p>Username: {this.props.auth.userName}</p>
            <p>Bio: {this.props.auth.bio}</p>

        </div>;
    }
  }

  render() {
    return (
        <div>
            {this.renderContent()}

        </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(UserInfo);