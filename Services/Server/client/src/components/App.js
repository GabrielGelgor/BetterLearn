import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

//.js pages that are loaded
import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import UserInfo from './UserInfo';
//const UserInfo = () => <h2>UserInfo</h2>;

//fetches the users state on whether ther logged in or not
class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

//decide which .js files to load/render depending on the route/path
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header/>
            <Route exact path="/" component={Landing} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route path="/userinfo" component={UserInfo} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);