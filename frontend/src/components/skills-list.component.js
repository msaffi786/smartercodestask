import React, { Component } from "react";
import SkillDataService from "../services/skill.service";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import authService from "../services/auth.service";
import Sidebar from "./sidebar";

export default class SkillsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveSkills = this.retrieveSkills.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveSkill = this.setActiveSkill.bind(this);
    this.removeAllSkills = this.removeAllSkills.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      skills: [],
      currentSkill: null,
      currentIndex: -1,
      searchTitle: "",
      currentUser: authService.getCurrentUser(),
    };
  }

  componentDidMount() {
    this.retrieveSkills();
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

  refreshList() {
    this.retrieveSkills();
    this.setState({
      currentSkill: null,
      currentIndex: -1,
    });
  }

  setActiveSkill(skill, index) {
    this.setState({
      currentSkill: skill,
      currentIndex: index,
    });
  }

  removeAllSkills() {
    SkillDataService.deleteAll()
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
      currentSkill: null,
      currentIndex: -1,
    });

    SkillDataService.findByTitle(this.state.searchTitle)
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

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { currentUser } = this.state;
    const { searchTitle, skills, currentSkill, currentIndex } = this.state;

    return (
      <div class="card">
        <div class="card-body">
          <div className="container">
            <div className="row">
              <div className="col-4">
                <Sidebar />
              </div>
              <div className="col-8">
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
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={this.searchTitle}
                        >
                          Search
                        </button>
                      </div>
                      <a class="btn btn-primary" href="/addskill" role="button">
                        Add skill
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h4>Skills List</h4>

                    <ul className="list-group">
                      {skills &&
                        skills.map((skill, index) => (
                          <li
                            className={
                              "list-group-item " +
                              (index === currentIndex ? "active" : "")
                            }
                            onClick={() => this.setActiveSkill(skill, index)}
                            key={index}
                          >
                            {skill.title}
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
                                      index <=
                                      (skill.rating || this.state.rating)
                                        ? "on"
                                        : "off"
                                    }
                                  >
                                    <span className="star">&#9733;</span>
                                  </button>
                                );
                              })}
                            </div>
                          </li>
                        ))}
                    </ul>

                    <button
                      className="m-3 btn btn-sm btn-danger"
                      onClick={this.removeAllSkills}
                    >
                      Remove All
                    </button>
                  </div>
                  <div className="col-md-6">
                    {currentSkill ? (
                      <div>
                        <h4>Skill</h4>
                        <div>
                          <label>
                            <strong>Title:</strong>
                          </label>{" "}
                          {currentSkill.title}
                        </div>
                        <div>
                          <label>
                            <strong>Description:</strong>
                          </label>{" "}
                          {currentSkill.description}
                        </div>
                        <div>
                          <label>
                            <strong>Rating:</strong>
                          </label>{" "}
                          {currentSkill.rating}
                        </div>

                        <Link
                          to={"/skills/" + currentSkill.id}
                          className="badge badge-warning"
                        >
                          Edit
                        </Link>
                      </div>
                    ) : (
                      <div>
                        <br />
                        <p>Please click on a Skill...</p>
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
