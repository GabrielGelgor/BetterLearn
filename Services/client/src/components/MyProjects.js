import React, { Component } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

class MyProjects extends Component {
  state = {
    user: null,
    projects: [],
  };

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    axios.get("/auth/current_user").then((response) => {
      axios.get(`/api/getUser/${response.data.id}`).then((response) => {
        this.setState({
          user: response.data,
        });
        this.state.user.projects.map((projectid) =>
          axios.post(`/api/getProject/${projectid}`, this.state.user.id).then(
            (response) => {
              this.setState({
                projects: [...this.state.projects, response.data.resp],
              });
            },
            (error) => {
              console.log(error);
            }
          )
        );
      });
    });
  }

  renderContent() {
    if (this.state.projects.length === 0) {
      return (
        <div>
          <p>
            No projects added, go to all projects to find some interesting
            projects for you to sign up for.
          </p>
          <a className="btn btn-primary btn-tech" href="/allprojects">
            All Projects
          </a>
        </div>
      );
    } else {
      return (
        <ul>
          {this.state.projects.map((item, index) => (
            <NavLink key={index} exact={true} to={`/project${item._id}`}>
              <li className="techs-item" key={index}>
                <div className="project-card">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <small>Click to get more details.</small>
                </div>
              </li>
            </NavLink>
          ))}
        </ul>
      );
    }
  }

  render() {
    return <div className="text-content">{this.renderContent()}</div>;
  }
}

export default MyProjects;
