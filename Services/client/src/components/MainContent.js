import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import UserInfo from "./UserInfo";
import MyProjects from "./MyProjects";
import AllProjects from "./AllProjects";
import CreateProject from "./CreateProject";
import Project from "./Project";
import SearchUdemy from "./SearchUdemy";
import SearchProjects from "./SearchProjects";

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

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

  updateProjects() {
    console.log(this.state);
    this.getProjects();
  }

  render() {
    return (
      <div>
        <div className="right-top">
          <Switch>
            <Route exact={true} path="/" children="Welcome" />
            <Route exact={true} path="/dashboard" children="Home" />
            <Route exact={true} path="/userinfo" children="My Profile" />
            <Route exact={true} path="/myprojects" children="My Projects" />
            <Route exact={true} path="/searchudemy" children="Search Udemy" />
            <Route
              exact={true}
              path="/searchprojects"
              children="Search Projects"
            />
            <Route
              exact={true}
              path="/createproject"
              children="Create Project"
            />
            <Route exact={true} path="/allprojects" children="All Projects" />
            {this.state.projects.length > 0
              ? this.state.projects.map((item, index) => (
                  <Route
                    key={index}
                    exact={true}
                    path={`/project${item._id}`}
                    children={`Project ${item._id}`}
                  />
                ))
              : ""}
          </Switch>
        </div>
        <div className="container">
          <Switch>
            <Route exact={true} path="/" children={<Landing />} />
            <Route exact={true} path="/dashboard" children={<Dashboard />} />
            <Route exact={true} path="/userinfo" children={<UserInfo />} />
            <Route exact={true} path="/myprojects" children={<MyProjects />} />
            <Route
              exact={true}
              path="/searchUdemy"
              children={<SearchUdemy />}
            />
            <Route
              exact={true}
              path="/searchprojects"
              children={<SearchProjects />}
            />
            <Route
              exact={true}
              path="/createproject"
              children={
                <CreateProject updateProjects={() => this.updateProjects()} />
              }
            />
            <Route
              exact={true}
              path="/allprojects"
              children={<AllProjects />}
            />
            {this.state.projects.length > 0
              ? this.state.projects.map((item, index) => (
                  <Route
                    key={index}
                    exact={true}
                    path={`/project${item._id}`}
                    children={<Project project={item} />}
                  />
                ))
              : ""}
          </Switch>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(MainContent);
