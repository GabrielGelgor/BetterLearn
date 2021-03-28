import React, { Component } from "react";
import axios from "axios";

class CreateProject extends Component {
  state = {
    user: null,
    added: false,
    project: null,
  };

  componentDidMount() {
    this.getUser();
  }

  createProject = (event) => {
    event.preventDefault();
    if (this.state.user) {
      const data = {
        title: String(document.querySelector("#title").value),
        owner: this.state.user.id,
        contributors: [],
        description: String(document.querySelector("#description").value),
      };

      axios.post(`/api/addProject`, data).then(
        (response) => {
          console.log(response.data.resp);
          this.setState({
            added: true,
            project: response.data.resp,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
    document.querySelector("#create-form").reset();
  };

  getUser() {
    axios.get("/auth/current_user").then((response) => {
      axios.get(`/api/getUser/${response.data.id}`).then((response) => {
        this.setState({
          user: response.data,
        });
      });
    });
  }

  renderContent() {
    if (this.state.added === false) {
      return (
        <div>
          <h4>Add a new project:</h4>
          <form
            id="create-form"
            className="input-form"
            onSubmit={this.createProject}
          >
            <div className="row">
              <div className="form-item col col-sm-12">
                <input
                  required="required"
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Add project title..."
                />
              </div>
              <div className="form-item col col-sm-12">
                <textarea
                  className="form-control"
                  id="description"
                  placeholder="Add a short project description..."
                ></textarea>
              </div>
              <div className="form-item col col-sm-12">
                <input
                  type="submit"
                  className="btn btn-primary btn-tech"
                  value="Add Project"
                />
              </div>
            </div>
          </form>
        </div>
      );
    } else if (this.state.added === true && this.state.project) {
      return (
        <div>
          <h4>New project added! Details below:</h4>
          <p className="regular-text">Title: {this.state.project.title}</p>
          <p className="regular-text">
            Description: {this.state.project.description}
          </p>
          <p className="regular-text">
            Contributors: {this.state.project.contributors}
          </p>
          <p className="regular-text">
            Project Score: {this.state.project.score}
          </p>
          <a className="btn btn-primary btn-tech" href="/createproject">
            Create Another Project
          </a>
        </div>
      );
    } else {
      return;
    }
  }

  render() {
    return <div className="text-content">{this.renderContent()}</div>;
  }
}

export default CreateProject;
