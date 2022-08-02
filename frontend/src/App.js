import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "./App.css";
import AddSkill from "./components/add-skill.component";
import Skill from "./components/skill.component";
import SkillsList from "./components/skills-list.component";
import AddProject from "./components/add-project.component";
import Project from "./components/project.component";
import ProjectsList from "./components/projects-list.component";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import authService from "./services/auth.service";
import eventBus from "./common/EventBus";
import Sidebar from "./components/sidebar";
import ResumeModal from "./components/resume-modal.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = authService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }

    eventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    eventBus.remove("logout");
  }

  logOut() {
    authService.logout();
    this.setState({
      currentUser: undefined,
    });
  }
  render() {
    //auth
    const { currentUser } = this.state;

    return (
      <div>
        <div>
          <Switch>
            <Route exact path="/skills" component={SkillsList} />
            <Route exact path="/addskill" component={AddSkill} />
            <Route path="/skills/:id" component={Skill} />
            <Route exact path="/projects" component={ProjectsList} />
            <Route exact path="/addproject" component={AddProject} />
            <Route path="/projects/:id" component={Project} />
            <Route exact path="/login" component={Login} />
            <Route exact path={["/", "/register"]} component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/sidebar" component={Sidebar} />
            <Route exact path="/resume" component={ResumeModal} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
