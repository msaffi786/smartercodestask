import React, { Component } from "react";
import ProjectDataService from "../services/project.service";
import { Link } from "react-router-dom";
import AddProject from "./add-project.component";
import { Redirect } from "react-router-dom";
import authService from "../services/auth.service";
import Sidebar from "./sidebar";

export default class ProjectsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveProjects = this.retrieveProjects.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveProject = this.setActiveProject.bind(this);
    this.removeAllProjects = this.removeAllProjects.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      Projects: [],
      currentProject: null,
      currentIndex: -1,
      searchTitle: "",
      currentUser: authService.getCurrentUser(),
    };
  }

  componentDidMount() {
    this.retrieveProjects();
    const currentUser = authService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true });
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle,
    });
  }

  retrieveProjects() {
    ProjectDataService.findByUserId(this.state.currentUser.id)
      .then((response) => {
        this.setState({
          projects: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveProjects();
    this.setState({
      currentProject: null,
      currentIndex: -1,
    });
  }

  setActiveProject(project, index) {
    this.setState({
      currentProject: project,
      currentIndex: index,
    });
  }

  removeAllProjects() {
    ProjectDataService.deleteAll()
      .then((response) => {
        console.log(response.data);
        this.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  searchTitle() {
    this.setState({
      currentProject: null,
      currentIndex: -1,
    });

    ProjectDataService.findByTitle(this.state.searchTitle)
      .then((response) => {
        this.setState({
          Projects: response.data,
        });
        console.log(response.data);
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
    const { searchTitle, projects, currentProject, currentIndex } = this.state;

    return (
      <div class="card">
        <div class="card-body">
          <div className="container">
            <div className="row">
              <div className="col-4">
                <Sidebar />
              </div>
              <div className="col-8">
                <div className="container">
                  <div className="list row">
                    <div className="col-md-8">
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by title"
                          value={searchTitle}
                          onChange={this.onChangeSearchTitle}
                        />
                        <div className="col-sm input-group-append">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={this.searchTitle}
                          >
                            Search
                          </button>
                        </div>

                        <a
                          class="btn btn-primary"
                          href="/addproject"
                          role="button"
                        >
                          Add Project
                        </a>
                      </div>
                      <div className="col-md-6">
                        <h4>Projects List</h4>

                        <ul className="list-group">
                          {projects &&
                            projects.map((project, index) => (
                              <li
                                className={
                                  "list-group-item " +
                                  (index === currentIndex ? "active" : "")
                                }
                                onClick={() =>
                                  this.setActiveProject(project, index)
                                }
                                key={index}
                              >
                                {project.title}
                                {project.projectskill.map((item) => (
                                  <strong>{item.skillId}</strong>
                                ))}
                              </li>
                            ))}
                        </ul>

                        <button
                          className="m-3 btn btn-sm btn-danger"
                          onClick={this.removeAllProjects}
                        >
                          Remove All
                        </button>
                      </div>
                      <div className="col-md-6">
                        {currentProject ? (
                          <div>
                            <h4>Project</h4>
                            <div>
                              <label>
                                <strong>Title:</strong>
                              </label>{" "}
                              {currentProject.title}
                            </div>
                            <div>
                              <label>
                                <strong>Description:</strong>
                              </label>{" "}
                              {currentProject.description}
                            </div>
                            <div>
                              <label>
                                <strong>Status:</strong>
                              </label>{" "}
                              {currentProject.published
                                ? "Published"
                                : "Pending"}
                            </div>

                            <Link
                              to={"/projects/" + currentProject.id}
                              className="badge badge-warning"
                            >
                              Edit
                            </Link>
                          </div>
                        ) : (
                          <div>
                            <br />
                            <p>Please click on a Project...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
