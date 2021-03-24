import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

//checks state of user (whether ther logged in or not) and acts accordingly
class Dashboard extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <p> Please <a href="/auth/google">Login </a>to view Dashboard</p>;

      //if logged in render/return the following
      //Muhammed put your code here
      default:
        return <div>
        
            <h2>Dashboard</h2>
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

export default connect(mapStateToProps)(Dashboard);
