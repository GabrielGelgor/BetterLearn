import React, { Component } from "react";
import axios from "axios";

class SearchUdemy extends Component {
  state = {
    searchInitiated: false,
    searchResults: [],
  };

  onSearchProject = (event) => {
    event.preventDefault();
    this.searchProjects(String(document.querySelector("#project").value));
  };

  searchProjects(query) {
    const data = { term: query };
    axios.post(`/search/courses`, data).then(
      (response) => {
        this.setState({
          searchResults: response.data.resp,
          searchInitiated: true,
        });
      },
      (error) => {
        console.log(error);
      }
    );
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
              <li key={index} className="techs-item">
                <a
                  href={`https://udemy.com${item.url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="project-card row">
                    <div className="col-sm-3">
                      <img
                        className="udemy-img"
                        src={item.thumbnail}
                        alt={item.title}
                      />
                    </div>
                    <div className="col-sm-9">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </a>
              </li>
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
                    value="Search Udemy"
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

export default SearchUdemy;
