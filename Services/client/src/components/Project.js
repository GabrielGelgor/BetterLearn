import React, { Component } from "react";
import axios from "axios";
import { TiDelete } from "react-icons/ti";

class Project extends Component {
  state = {
    projectID: this.props.project._id,
    project: null,
    user: null,
    projectOwner: null,
    projectUsers: [],
    comments: [],
    hasVoted: false,
    vote: 0,
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
      if (this.state.projects) {
      }
    }
  };

  createComment = (event) => {
    event.preventDefault();
    if (this.state.project && this.state.user) {
      let commentData = {
        comment: String(document.querySelector("#comment").value),
        commenter: this.state.user.id,
      };
      const data = {
        comments: [...this.state.project.comments, commentData],
      };
      this.updateProject(data);
      const previousComments = this.state.comments.slice();
      const newComment = {
        comment: commentData.comment,
        commenter: this.state.user.userName,
        commenterID: commentData.commenter,
      };
      this.setState({
        comments: [...previousComments, newComment],
      });
    }
    document.querySelector("#create-form").reset();
  };

  incrementScore = (event) => {
    event.preventDefault();
    if (this.state.project && this.state.user) {
      const data = {
        score: this.state.project.score + 1,
        voters: [
          ...this.state.project.voters,
          { voter: this.state.user.id, vote: 1 },
        ],
      };
      this.updateProject(data);
      this.setState({
        hasVoted: true,
        vote: 1,
      });
    }
  };

  decrementScore = (event) => {
    event.preventDefault();
    if (this.state.project) {
      const data = {
        score: this.state.project.score - 1,
        voters: [
          ...this.state.project.voters,
          { voter: this.state.user.id, vote: -1 },
        ],
      };
      this.updateProject(data);
      this.setState({
        hasVoted: true,
        vote: -1,
      });
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
        this.setState({
          project: null,
        });
        console.log(error);
      }
    );
  }

  updateUser(id, data) {
    console.log("Sending this project list: ", data);
    axios.post(`/api/updateUser/${id}`, data).then(
      (response) => {
        console.log(response.data.resp);
        this.setState({
          user: response.data.resp,
        });
      },
      (error) => {
        this.setState({
          user: null,
        });
        console.log(error);
      }
    );
  }

  addProject = () => {
    if (this.state.user && this.state.project && this.state.projectID) {
      const contributorExists =
        this.state.project.contributors.filter(
          (item) => item === this.state.user.id
        ).length > 0;
      const projectExists =
        this.state.user.projects.filter((item) => item === this.state.projectID)
          .length > 0;

      const projectData = {
        contributors: contributorExists
          ? this.state.project.contributors
          : [...this.state.project.contributors, this.state.user.id],
      };
      const userData = {
        projects: projectExists
          ? this.state.user.projects
          : [...this.state.user.projects, this.state.projectID],
      };

      this.updateUser(this.state.user.id, userData);
      this.updateProject(projectData);
      if (this.state.user && this.state.project) {
        const isProjectUserAdded =
          this.state.projectUsers.filter(
            (item) => item.id === this.state.user.id
          ).length > 0;
        if (!isProjectUserAdded) {
          this.setState({
            projectUsers: [...this.state.projectUsers, this.state.user],
          });
        }
      }
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
          (item) => item !== this.state.projectID
        ),
      };
      this.updateUser(this.state.user.id, userData);
      this.updateProject(projectData);
      if (this.state.user && this.state.project) {
        this.setState({
          projectUsers: this.state.projectUsers.filter(
            (item) => item.id !== this.state.user.id
          ),
        });
      }
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
    axios.get("/auth/current_user").then(
      (response) => {
        axios.get(`/api/getUser/${response.data.id}`).then(
          (response) => {
            this.setState({
              user: response.data,
            });
            if (this.state.projectID) {
              this.getProject(this.state.projectID, response.data.id);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
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

  getProject(id, data) {
    axios.post(`/api/getProject/${id}`, data).then(
      (response) => {
        this.setState({
          project: response.data.resp,
        });
        this.getUsersByID(response.data.resp.contributors);
        this.getCommentUsers(response.data.resp.comments);
        if (this.state.user) {
          let voter = response.data.resp.voters.find(
            (item) => item.voter === this.state.user.id
          );
          if (voter) {
            this.setState({
              hasVoted: true,
              vote: voter.vote,
            });
          }
        }
      },
      (error) => {
        console.log(error);
      }
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

  getProjectOwner() {
    if (this.state.project) {
      axios.get(`/api/getUser/${this.state.project.owner}`).then(
        (response) => {
          this.setState({
            projectOwner: response.data,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  getCommentUsers(comments) {
    comments.map((comment) => {
      axios.get(`/api/getUser/${comment.commenter}`).then(
        (response) => {
          this.setState({
            comments: [
              ...this.state.comments,
              {
                comment: comment.comment,
                commenter: response.data.userName,
                commenterID: comment.commenter,
              },
            ],
          });
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  isOwner() {
    if (this.state.user && this.state.project) {
      return this.state.user.id === this.state.project.owner;
    }
    return false;
  }

  dummy(event) {
    event.preventDefault();
  }

  renderContent() {
    if (this.state.project) {
      if (!this.state.projectOwner) {
        this.getProjectOwner();
      }
      return (
        <div className="project-card">
          <div>
            <h3>{this.state.project.title}</h3>
          </div>
          <div className="mt-2">
            <p>{this.state.project.description}</p>
            <p>
              Project owner:{" "}
              {this.state.projectOwner
                ? this.state.projectOwner.userName
                : "No owner found."}
            </p>
            <div className="single-row">
              <small>Score: {this.state.project.score}</small>
              <button
                onClick={this.state.hasVoted ? this.dummy : this.incrementScore}
                className={
                  this.state.hasVoted && this.state.vote > 0
                    ? "btn btn-primary btn-tech btn-green"
                    : "btn btn-primary btn-tech"
                }
              >
                +
              </button>
              <button
                onClick={this.state.hasVoted ? this.dummy : this.decrementScore}
                className={
                  this.state.hasVoted && this.state.vote < 0
                    ? "btn btn-primary btn-tech btn-red"
                    : "btn btn-primary btn-tech"
                }
              >
                -
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p>Project Contributors:</p>
            {this.state.projectUsers.length === 0 ? (
              <p>No contributors found.</p>
            ) : (
              <ul>
                {this.state.projectUsers.map((item, index) => (
                  <li className="techs-item" key={index}>
                    {item.userName}
                  </li>
                ))}
              </ul>
            )}
            <div className="single-row mt-4">
              {this.addRemovetoProfileButton()}
              {this.deleteButton()}
            </div>
            <p className="mt-4">Comments:</p>
            <ul>
              {this.state.comments.length > 0
                ? this.state.comments.map((item, index) => (
                    <li className="techs-item comments-item" key={index}>
                      <div className="row">
                        <div className="col-sm-10">{item.comment}</div>
                        <div className="col-sm-2">
                          {item.commenterID === this.state.user.id ? (
                            <TiDelete
                              className="delete-icon"
                              size="1.0em"
                              onClick={this.deleteComment.bind(this, index)}
                            ></TiDelete>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <small>Made by: {item.commenter}</small>
                        </div>
                      </div>
                    </li>
                  ))
                : ""}
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
      return;
    }
  }

  render() {
    return <div className="text-content">{this.renderContent()}</div>;
  }
}

export default Project;
