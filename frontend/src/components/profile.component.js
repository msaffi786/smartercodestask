import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Switch, Route, Link } from "react-router-dom";
import Sidebar from "./sidebar";
import ProfileDataService from "../services/profile.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeAbout = this.onChangeAbout.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.newProfile = this.newProfile.bind(this);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: AuthService.getCurrentUser(),
      name: "",
      about: "",
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeAbout(e) {
    this.setState({
      about: e.target.value,
    });
  }

  saveProfile() {
    var data = {
      name: this.state.name,
      about: this.state.about,
      currentUser: this.state.currentUser,
    };

    ProfileDataService.create(data)
      .then((response) => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          about: response.data.about,
          submitted: true,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateProfile() {
    var data = {
      name: this.state.name,
      about: this.state.about,
      currentUser: this.state.currentUser,
    };

    ProfileDataService.update(data)
      .then((response) => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          about: response.data.about,
          submitted: true,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  newProfile() {
    this.setState({
      id: null,
      currentUser: AuthService.getCurrentUser(),
      name: "",
      about: "",
      submitted: false,
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { currentUser } = this.state;

    return (
      <div class="card">
        <div class="card-body">
          <div className="container">
            <div className="row">
              <div className="col-4">
                <Sidebar />
              </div>
              <div className="col-8">
                <div className="submit-form">
                  {this.state.submitted ? (
                    <div>
                      <header className="jumbotron">
                        <h3>
                          <strong>{currentUser.username}</strong> Profile
                        </h3>
                      </header>
                      <p>
                        <strong>Token:</strong>{" "}
                        {currentUser.accessToken.substring(0, 20)} ...{" "}
                        {currentUser.accessToken.substr(
                          currentUser.accessToken.length - 20
                        )}
                      </p>
                      <p>
                        <strong>Id:</strong> {currentUser.id}
                      </p>
                      <p>
                        <strong>Email:</strong> {currentUser.email}
                      </p>

                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          required
                          value={this.state.name}
                          placeholder={this.state.name}
                          onChange={this.onChangeName}
                          name="name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="about">About</label>
                        <input
                          type="text"
                          className="form-control"
                          id="about"
                          required
                          value={this.state.about}
                          placeholder={this.state.about}
                          onChange={this.onChangeAbout}
                          name="about"
                        />
                      </div>

                      <button
                        onClick={this.updateProfile}
                        className="btn btn-success"
                      >
                        update
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          required
                          value={this.state.name}
                          onChange={this.onChangeName}
                          name="name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="about">About</label>
                        <input
                          type="text"
                          className="form-control"
                          id="about"
                          required
                          value={this.state.about}
                          onChange={this.onChangeAbout}
                          name="about"
                        />
                      </div>

                      <button
                        onClick={this.saveProfile}
                        className="btn btn-success"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// {(this.state.userReady) ?
//   <div>
//   <header className="jumbotron">
//     <h3>
//       <strong>{currentUser.username}</strong> Profile
//     </h3>
//   </header>
//   <p>
//     <strong>Token:</strong>{" "}
//     {currentUser.accessToken.substring(0, 20)} ...{" "}
//     {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
//   </p>
//   <p>
//     <strong>Id:</strong>{" "}
//     {currentUser.id}
//   </p>
//   <p>
//     <strong>Email:</strong>{" "}
//     {currentUser.email}
//   </p>

// </div>: null}
