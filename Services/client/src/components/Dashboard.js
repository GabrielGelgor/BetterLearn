import React, { Component } from "react";
import axios from "axios";

//checks state of user (whether ther logged in or not) and acts accordingly
class Dashboard extends Component {
  state = {
    user: null,
  };

  componentDidMount() {
    this.getUser();
  }

  renderContent() {
    switch (this.state.user) {
      case null:
        return;
      case false:
        return (
          <p className="regular-text">
            {" "}
            Please <a href="/auth/google">Login </a>to view Dashboard
          </p>
        );

      //if logged in render/return the following
      //Muhammed put your code here
      default:
        if (this.state.user !== null) {
          return (
            <div>
              <p className="regular-text">
                Hello, {this.state.user.userName}, you have{" "}
                {this.state.user.projects.length} projects assigned to you!
              </p>
              <div>
                <a className="btn btn-primary btn-tech" href="/userinfo">
                  Check out my profile!
                </a>
              </div>
              <div className="mt-4">
                <a className="btn btn-primary btn-tech" href="/myprojects">
                  Go to My Projects
                </a>
              </div>
            </div>
          );
        } else {
          // return;
          return (
            <div>
              <h3>Home</h3>
            </div>
          );
        }
    }
  }

  getUser() {
    axios.get("/auth/current_user").then((response) => {
      axios.get(`/api/getUser/${response.data.id}`).then((response) => {
        this.setState({
          user: response.data,
        });
      });
    });
  }

  render() {
    return <div className="text-content">{this.renderContent()}</div>;
  }
}

export default Dashboard;
