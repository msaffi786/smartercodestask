import React, { Component } from "react";
import ProjectDataService from "../services/project.service";
import authService from "../services/auth.service";
import Sidebar from "./sidebar";
import SkillDataService from "../services/skill.service";

export default class AddProject extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.newProject = this.newProject.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      published: false,
      submitted: false,
      skills: [],
      skillchecked: [],
      isChecked: false,
      currentUser: authService.getCurrentUser()
        ? authService.getCurrentUser()
        : "no user",
    };
  }

  componentDidMount() {
    this.retrieveSkills();
    const currentUser = authService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true });
  }

  retrieveSkills() {
    SkillDataService.findByUserId(this.state.currentUser.id)
      .then((response) => {
        this.setState({
          skills: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
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

  onChangeOption(e) {
    this.setState({
      selected: e.target.value,
    });
  }

  saveProject() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      rating: this.state.rating,
      skills: this.state.skillchecked,
      currentUser: authService.getCurrentUser()
        ? authService.getCurrentUser()
        : "no user",
    };

    ProjectDataService.create(data)
      .then((response) => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          published: response.data.published,
          skills: response.data.skills,
          submitted: true,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  newProject() {
    this.retrieveSkills();
    this.setState({
      id: null,
      title: "",
      description: "",
      published: false,
      submitted: false,
      skillchecked: [],
      isChecked: false,
    });
  }

  handleInputChange(e) {
    const target = e.target;
    var value = target.value;
    if (target.checked == true) {
      this.state.skillchecked[value] = { skillId: value };
    } else {
      this.state.skillchecked.splice(value, 1);
    }
  }
  submit() {
    console.warn(this.state);
  }

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <div className="container">
            <div className="row">
              <div className="col-4">
                <Sidebar />
              </div>
              <div className="col-8">
                <div className="container">
                  <div className="submit-form">
                    {this.state.submitted ? (
                      <div>
                        <div
                          className="alert alert-success alert-dismissible fade show"
                          role="alert"
                        >
                          Project successfully created
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
                          onClick={this.newProject}
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

                        <div>
                          <p>Check list the skill for the Project</p>
                          {this.state.skills.map((item) => (
                            <ul>
                              <li>
                                <label>
                                  <input
                                    type="checkbox"
                                    value={item.id}
                                    onChange={this.handleInputChange}
                                  />{" "}
                                  {item.value}
                                  <strong>{item.title}</strong>
                                </label>
                              </li>
                            </ul>
                          ))}
                          <div class="col-md-12 text-center">
                            <button
                              type="submit"
                              class="btn btn-primary"
                              onClick={() => this.submit()}
                            >
                              Submit
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={this.saveProject}
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
      </div>
    );
  }
}
