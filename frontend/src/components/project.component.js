import React, { Component } from "react";
import authService from "../services/auth.service";
import ProjectDataService from "../services/project.service";
import { Redirect } from "react-router-dom";

export default class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);

    this.state = {
      currentProject: {
        id: null,
        title: "",
        description: "",
        published: false,
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getProject(this.props.match.params.id);
    const currentUser = authService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true });
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function (prevState) {
      return {
        currentProject: {
          ...prevState.currentProject,
          title: title,
        },
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState((prevState) => ({
      currentProject: {
        ...prevState.currentProject,
        description: description,
      },
    }));
  }

  getProject(id) {
    ProjectDataService.get(id)
      .then((response) => {
        this.setState({
          currentProject: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentProject.id,
      title: this.state.currentProject.title,
      description: this.state.currentProject.description,
      published: status,
    };

    ProjectDataService.update(this.state.currentProject.id, data)
      .then((response) => {
        this.setState((prevState) => ({
          currentProject: {
            ...prevState.currentProject,
            published: status,
          },
        }));
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateProject() {
    ProjectDataService.update(
      this.state.currentProject.id,
      this.state.currentProject
    )
      .then((response) => {
        console.log(response.data);
        this.setState({
          message: "The Project was updated successfully!",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteProject() {
    ProjectDataService.delete(this.state.currentProject.id)
      .then((response) => {
        console.log(response.data);
        this.props.history.push("/projects");
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
    const { currentProject } = this.state;

    return (
      <div>
        {currentProject ? (
          <div className="edit-form">
            <h4>Project</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentProject.title}
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentProject.description}
                  onChange={this.onChangeDescription}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentProject.published ? "Published" : "Pending"}
              </div>
            </form>

            {currentProject.published ? (
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
              onClick={this.deleteProject}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateProject}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Project...</p>
          </div>
        )}
      </div>
    );
  }
}
