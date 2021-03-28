import React, { Component } from "react";
import axios from "axios";
import { TiDelete } from "react-icons/ti";

class Project extends Component {
  state = {
    project: this.props.project,
    user: null,
    projectUsers: [],
  };

  componentDidMount() {
    this.getUser();
  }

  deleteComment = (index, event) => {
    event.preventDefault();
    if (this.state.project) {
      const data = {
        comments: this.state.project.comments.filter(
          (item) => item !== this.state.project.comments[index]
        ),
      };
      this.updateProject(data);
    }
  };

  createComment = (event) => {
    event.preventDefault();
    if (this.state.project) {
      const data = {
        comments: [
          ...this.state.project.comments.slice(),
          String(document.querySelector("#comment").value),
        ],
      };
      this.updateProject(data);
    }
    document.querySelector("#create-form").reset();
  };

  incrementScore = (event) => {
    event.preventDefault();
    if (this.state.project) {
      const data = {
        score: this.state.project.score + 1,
      };
      this.updateProject(data);
    }
  };

  decrementScore = (event) => {
    event.preventDefault();
    if (this.state.project) {
      const data = {
        score: this.state.project.score - 1,
      };
      this.updateProject(data);
    }
  };

  updateProject(data) {
    axios.post(`/api/updateProject/${this.state.project._id}`, data).then(
      (response) => {
        this.setState({
          project: response.data.resp,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateUser(id, data) {
    axios.post(`/api/updateUser/${id}`, data).then(
      (response) => {
        this.setState({
          user: response.data.resp,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addProject = () => {
    if (this.state.user && this.state.project) {
      const projectData = {
        contributors: [...this.state.project.contributors, this.state.user.id],
      };
      const userData = {
        projects: [...this.state.user.projects, this.state.project._id],
      };
      this.updateUser(this.state.user.id, userData);
      this.updateProject(projectData);
    }
  };

  removeProject = () => {
    if (this.state.user && this.state.project) {
      const projectData = {
        contributors: this.state.project.contributors.filter(
          (item) => item !== this.state.user.id
        ),
      };
      const userData = {
        projects: this.state.user.projects.filter(
          (item) => item !== this.state.project._id
        ),
      };
      this.updateUser(this.state.user.id, userData);
      this.updateProject(projectData);
    }
  };

  deleteProject = () => {
    if (this.state.user && this.state.project) {
      this.getUsersByID(this.state.project.contributors);
      this.state.projectUsers.map((user) =>
        this.updateUser(user.id, {
          projects: user.projects.filter(
            (project) => project !== this.state.project._id
          ),
        })
      );
      axios.delete(`/api/deleteProject/${this.state.project._id}`).then(
        (response) => {
          this.setState({
            projectUsers: [],
            project: null,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
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

  getUsersByID(contributors) {
    contributors.map((contributorid) =>
      axios.get(`/api/getUser/${contributorid}`).then(
        (response) => {
          this.setState({
            projectUsers: [...this.state.projectUsers, response.data],
          });
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  addRemovetoProfileButton() {
    if (this.state.user && this.state.project) {
      const addedProject = this.state.project.contributors.filter(
        (item) => item === this.state.user.id
      );
      if (addedProject.length > 0) {
        return (
          <button
            onClick={this.removeProject}
            className="btn btn-primary btn-tech"
          >
            Remove from profile
          </button>
        );
      } else {
        return (
          <button
            onClick={this.addProject}
            className="btn btn-primary btn-tech"
          >
            Add to profile
          </button>
        );
      }
    }
  }

  deleteButton() {
    if (this.state.user && this.state.project) {
      if (this.isOwner()) {
        return (
          <button
            onClick={this.deleteProject}
            className="btn btn-primary btn-tech"
          >
            Delete Project
          </button>
        );
      } else {
        return;
      }
    }
  }

  isOwner() {
    if (this.state.user && this.state.project) {
      return this.state.user.id === this.state.project.owner;
    }
    return false;
  }

  renderContent() {
    if (this.state.project) {
      return (
        <div className="project-card">
          <div>
            <h4>{this.state.project.title}</h4>
            <div className="single-row">
              {this.addRemovetoProfileButton()}
              {this.deleteButton()}
            </div>
          </div>
          <div className="mt-2">
            <p>{this.state.project.description}</p>
            <div className="single-row">
              <small>Score: {this.state.project.score}</small>
              <button
                onClick={this.incrementScore}
                className="btn btn-primary btn-tech"
              >
                +
              </button>
              <button
                onClick={this.decrementScore}
                className="btn btn-primary btn-tech"
              >
                -
              </button>
            </div>
          </div>
          <div className="mt-2">
            <p>Contributors:</p>
            <ul>
              {this.state.project.contributors.map((item, index) => (
                <li className="techs-item" key={index}>
                  {item}
                </li>
              ))}
            </ul>
            <p>Comments:</p>
            <ul>
              {this.state.project.comments.map((item, index) => (
                <li className="techs-item comments-item" key={index}>
                  {item}
                  {this.isOwner() ? (
                    <TiDelete
                      size="1.0em"
                      onClick={this.deleteComment.bind(this, index)}
                    ></TiDelete>
                  ) : (
                    ""
                  )}
                </li>
              ))}
            </ul>

            <form
              id="create-form"
              className="input-form"
              onSubmit={this.createComment}
            >
              <div className="form-item col col-sm-12">
                <textarea
                  className="form-control"
                  id="comment"
                  placeholder="Add a comment..."
                ></textarea>
              </div>
              <div className="form-item col col-sm-12">
                <input
                  type="submit"
                  className="btn btn-primary btn-tech"
                  value="Add Comment"
                />
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <a className="btn btn-primary btn-tech" href="/allprojects">
          No project found, go to all projects
        </a>
      );
    }
  }

  render() {
    return <div className="text-content">{this.renderContent()}</div>;
  }
}

export default Project;
