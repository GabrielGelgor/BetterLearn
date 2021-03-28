import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

//.js pages that are loaded
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { BrowserRouter } from "react-router-dom";

//fetches the users state on whether ther logged in or not
class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }
  //decide which .js files to load/render depending on the route/path
  render() {
    return (
      <BrowserRouter>
        <div className="row main-container">
          <div className="col-sm-4 sidebar">
            <Sidebar />
          </div>
          <div className="col-sm-8 main-content">
            <MainContent />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(null, actions)(App);
