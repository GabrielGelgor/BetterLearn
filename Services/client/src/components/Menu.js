import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

class Menu extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <ul className="menu-list">
            <li>
              <a href="/auth/google">Login With Google</a>
            </li>
          </ul>
        );

      //if logged in render/return the following
      default:
        return (
          <ul className="menu-list">
            <li>
              <NavLink
                activeStyle={{ backgroundColor: "black" }}
                exact={true}
                to="/dashboard"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                activeStyle={{ backgroundColor: "black" }}
                exact={true}
                to="/userinfo"
              >
                My Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                activeStyle={{ backgroundColor: "black" }}
                exact={true}
                to="/myprojects"
              >
                My Projects
              </NavLink>
            </li>
            <li>
              <NavLink
                activeStyle={{ backgroundColor: "black" }}
                exact={true}
                to="/createproject"
              >
                Create Project
              </NavLink>
            </li>
            <li>
              <NavLink
                activeStyle={{ backgroundColor: "black" }}
                exact={true}
                to="/allprojects"
              >
                All Projects
              </NavLink>
            </li>
            <li>
              <NavLink
                activeStyle={{ backgroundColor: "black" }}
                exact={true}
                to="/searchprojects"
              >
                Search Projects
              </NavLink>
            </li>
            <li>
              <NavLink
                activeStyle={{ backgroundColor: "black" }}
                exact={true}
                to="/searchUdemy"
              >
                Search Udemy
              </NavLink>
            </li>
            <li>
              <a href="/auth/logout">Logout</a>
            </li>
          </ul>
        );
    }
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Menu);
