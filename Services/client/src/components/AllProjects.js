import React, { Component } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

class AllProjects extends Component {
  state = {
    projects: null,
  };

  componentDidMount() {
    this.getProjects();
  }

  getProjects() {
    axios.get(`/api/getProjects`).then((response) => {
      this.setState({
        projects: response.data,
      });
    });
  }

  renderContent() {
    if (this.state.projects) {
      return (
        <div className="regular-text">
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
        </div>
      );
    } else {
      return;
    }
  }

  render() {
    return (
      <div className="text-content">
        <h3>All Projects:</h3>
        {this.renderContent()}
      </div>
    );
  }
}

export default AllProjects;
