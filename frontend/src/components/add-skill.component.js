import React, { Component } from "react";
import SkillDataService from "../services/skill.service";
import Sidebar from "./sidebar";
import { Redirect } from "react-router-dom";
import authService from "../services/auth.service";

export default class AddSkill extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveSkill = this.saveSkill.bind(this);
    this.newSkill = this.newSkill.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      published: false,
      rating: 0,
      hover: 0,
      currentUser: authService.getCurrentUser()
        ? authService.getCurrentUser()
        : "no user",
      submitted: false,
    };
  }

  componentDidMount() {
    const currentUser = authService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true });
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  saveSkill() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      rating: this.state.rating,
      currentUser: this.state.currentUser,
    };

    SkillDataService.create(data)
      .then((response) => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          published: response.data.published,
          rating: response.data.rating,

          submitted: true,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  newSkill() {
    this.setState({
      id: null,
      title: "",
      description: "",
      published: false,
      rating: 0,

      submitted: false,
    });
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div className="card">
        <div className="card-body">
          <div className="container">
            <div className="row">
              <div className="col-4">
                <Sidebar />
              </div>
              <div className="col-8">
                <div className="submit-form">
                  {this.state.submitted ? (
                    <div>
                      <div
                        className="alert alert-success alert-dismissible fade show"
                        role="alert"
                      >
                        skill successfully created
                        <button
                          type="button"
                          className="close"
                          data-dismiss="alert"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <h4>You submitted successfully!</h4>
                      <button
                        className="btn btn-success"
                        onClick={this.newSkill}
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          required
                          value={this.state.title}
                          onChange={this.onChangeTitle}
                          name="title"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                          type="text"
                          className="form-control"
                          id="description"
                          required
                          value={this.state.description}
                          onChange={this.onChangeDescription}
                          name="description"
                        />
                      </div>
                      <div className="star-rating">
                        {[...Array(5)].map((star, index) => {
                          index += 1;
                          return (
                            <button
                              type="button"
                              id="rating"
                              data-testid="rating"
                              key={index}
                              className={
                                index <= (this.state.hover || this.state.rating)
                                  ? "on"
                                  : "off"
                              }
                              onClick={() => this.setState({ rating: index })}
                              onMouseEnter={() =>
                                this.setState({ rating: index })
                              }
                              onMouseLeave={() =>
                                this.setState({ rating: this.state.rating })
                              }
                            >
                              <span className="star">&#9733;</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={this.saveSkill}
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
