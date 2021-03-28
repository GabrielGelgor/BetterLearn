import React, { Component } from "react";
import axios from "axios";
import { TiDelete } from "react-icons/ti";

//checks state of user (whether ther logged in or not) and acts accordingly
class UserInfo extends Component {
  state = {
    user: null,
  };

  componentDidMount() {
    this.getUser();
  }

  deleteTech = (index, event) => {
    event.preventDefault();
    const data = {
      techs: this.state.user.techs.filter(
        (item) => item !== this.state.user.techs[index]
      ),
    };
    this.updateUser(data);
  };

  addTech = (event) => {
    event.preventDefault();
    const oldTechs = this.state.user.techs.slice();
    const newTech = String(document.getElementById("tech").value);
    const data = { techs: [...oldTechs, newTech] };
    this.updateUser(data);
  };

  updateBio = (event) => {
    event.preventDefault();
    const data = { bio: String(document.getElementById("bio").value) };
    this.updateUser(data);
  };

  updateUser(data) {
    axios.post(`/api/updateUser/${this.state.user.id}`, data).then(
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
    switch (this.state.user) {
      case null:
        return;
      case false:
        return (
          <p className="regular-text">
            {" "}
            Please <a href="/auth/google">Login </a>to view UserInfo
          </p>
        );
      default:
        if (this.state.user !== null) {
          return (
            <div>
              <p className="regular-text">
                Username: {this.state.user.userName}
              </p>
              <p className="regular-text">Bio: {this.state.user.bio}</p>
              <form onSubmit={this.updateBio}>
                <div className="row">
                  <div className="col-sm-6">
                    <input
                      required="required"
                      type="text"
                      className="form-control"
                      id="bio"
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="submit"
                      className="btn btn-primary btn-tech"
                      value="Update Bio"
                    />
                  </div>
                </div>
              </form>
              <br />
              <p className="regular-text">Techs:</p>
              <ul>
                {this.state.user.techs.map((item, index) => (
                  <li key={index} className="techs-item">
                    {item}
                    <TiDelete
                      size="1.0em"
                      onClick={this.deleteTech.bind(this, index)}
                    ></TiDelete>
                  </li>
                ))}
              </ul>
              <form onSubmit={this.addTech}>
                <div className="row">
                  <div className="col-sm-6">
                    <input
                      required="required"
                      type="text"
                      className="form-control"
                      id="tech"
                    />
                  </div>
                  <div className="col-sm-2">
                    <input
                      type="submit"
                      className="btn btn-primary btn-tech"
                      value="Add Tech"
                    />
                  </div>
                </div>
              </form>
              <br />
              <p className="regular-text">Projects:</p>
              {this.state.user.projects.length === 0 ? (
                <p className="regular-text">No projects found!</p>
              ) : (
                <div>
                  <p className="regular-text">
                    {this.state.user.projects.length} projects listed in
                    profile.
                  </p>
                  <a className="btn btn-primary btn-tech" href="/myprojects">
                    Go to My Projects
                  </a>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div>
              <h3>No User Found!</h3>
            </div>
          );
        }
    }
  }

  render() {
    return <div className="text-content">{this.renderContent()}</div>;
  }
}

export default UserInfo;
