import React, { Component } from "react";
import SkillDataService from "../services/skill.service";
import { Redirect } from "react-router-dom";
import authService from "../services/auth.service";

export default class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateSkill = this.updateSkill.bind(this);
    this.deleteSkill = this.deleteSkill.bind(this);

    this.state = {
      currentSkill: {
        id: null,
        title: "",
        description: "",
        published: false,
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getSkill(this.props.match.params.id);
    const currentUser = authService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true });
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function (prevState) {
      return {
        currentSkill: {
          ...prevState.currentSkill,
          title: title,
        },
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState((prevState) => ({
      currentSkill: {
        ...prevState.currentSkill,
        description: description,
      },
    }));
  }

  getSkill(id) {
    SkillDataService.get(id)
      .then((response) => {
        this.setState({
          currentSkill: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentSkill.id,
      title: this.state.currentSkill.title,
      description: this.state.currentSkill.description,
      published: status,
    };

    SkillDataService.update(this.state.currentSkill.id, data)
      .then((response) => {
        this.setState((prevState) => ({
          currentSkill: {
            ...prevState.currentSkill,
            published: status,
          },
        }));
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateSkill() {
    SkillDataService.update(this.state.currentSkill.id, this.state.currentSkill)
      .then((response) => {
        console.log(response.data);
        this.setState({
          message: "The Skill was updated successfully!",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteSkill() {
    SkillDataService.delete(this.state.currentSkill.id)
      .then((response) => {
        console.log(response.data);
        this.props.history.push("/skills");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { currentUser } = this.state;
    const { currentSkill } = this.state;

    return (
      <div>
        {currentSkill ? (
          <div className="edit-form">
            <h4>Skill</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentSkill.title}
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentSkill.description}
                  onChange={this.onChangeDescription}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentSkill.published ? "Published" : "Pending"}
              </div>
            </form>

            {currentSkill.published ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(false)}
              >
                UnPublish
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(true)}
              >
                Publish
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteSkill}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateSkill}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Skill...</p>
          </div>
        )}
      </div>
    );
  }
}
