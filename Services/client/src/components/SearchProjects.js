import React, { Component } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

class SearchProjects extends Component {
  state = {
    searchInitiated: false,
    searchResults: [],
  };

  onSearchProject = (event) => {
    event.preventDefault();
    this.searchProjects(String(document.querySelector("#project").value));
  };

  searchProjects(query) {
    axios.get(`/api/getProjects`).then((response) => {
      const foundProjects = response.data.filter(
        (project) => project.title.indexOf(query) !== -1
      );
      this.setState({
        searchResults: foundProjects,
        searchInitiated: true,
      });
    });
  }

  resetSearch = () => {
    this.setState({
      searchInitiated: false,
      searchResults: [],
    });
  };

  renderContent() {
    if (this.state.searchInitiated) {
      return (
        <div>
          <ul>
            {this.state.searchResults.map((item, index) => (
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
          <button
            onClick={this.resetSearch}
            className="btn btn-primary btn-tech"
          >
            Search Again
          </button>
        </div>
      );
    } else {
      return (
        <div className="single-row mt-4">
          <div className="col-sm-12">
            <form onSubmit={this.onSearchProject}>
              <div className="single-row">
                <div className="col-sm-9">
                  <input
                    id="project"
                    required="required"
                    className="form-control"
                    type="text"
                  />
                </div>
                <div className="col-sm-3">
                  <input
                    id="btn-search-projects"
                    type="submit"
                    value="Search Projects"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }

  render() {
    return <div className="regular-text">{this.renderContent()}</div>;
  }
}

export default SearchProjects;
