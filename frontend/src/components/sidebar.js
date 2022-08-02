import Button from "react-bootstrap/Button";
import { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import eventBus from "../common/EventBus";
import authService from "../services/auth.service";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      isOpen: false,
      currency: "$",
      currentDate: "",
      invoiceNumber: 1,
      dateOfIssue: "",
      billTo: "",
      billToEmail: "",
      billToAddress: "",
      billFrom: "",
      billFromEmail: "",
      billFromAddress: "",
      notes: "",
      total: "0.00",
      subTotal: "0.00",
      taxRate: "",
      taxAmmount: "0.00",
      discountRate: "",
      discountAmmount: "0.00",
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
  openModal = (event) => {
    event.preventDefault();
    this.setState({ isOpen: true });
  };
  closeModal = (event) => this.setState({ isOpen: false });
  render() {
    const { currentUser } = this.state;
    return (
      <div className="card">
        <div className="card-body">
          <div>
            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <div className="m-3">
                  <Button className="d-block w-75">
                    <Link to={"/profile"} className="nav-link">
                      {/* {currentUser.username} */}
                      My Profile
                    </Link>
                  </Button>
                </div>
                <div className="m-3">
                  <Button className="d-block w-75">
                    <Link to={"/skills"} className="nav-link">
                      skills
                    </Link>
                  </Button>
                </div>
                <div className="m-3">
                  <Button className="d-block w-75">
                    <Link to={"/addskill"} className="nav-link">
                      Add skill
                    </Link>
                  </Button>
                </div>

                <div className="m-3">
                  <Button className="d-block w-75">
                    <Link to={"/projects"} className="nav-link">
                      projects
                    </Link>
                  </Button>
                </div>
                <div className="m-3">
                  <Button className="d-block w-75">
                    <Link to={"/addproject"} className="nav-link">
                      addproject
                    </Link>
                  </Button>
                </div>
                <div className="m-3">
                  <Button className="d-block w-75">
                    <Link to={"/resume"} className="nav-link">
                      resume
                    </Link>
                  </Button>
                </div>
                <Button
                  variant="primary"
                  type="submit"
                  className="d-block w-100"
                >
                  Review Invoice
                </Button>
                <div className="m-3">
                  <Button className="d-block w-75">
                    <a href="/login" className="nav-link" onClick={this.logOut}>
                      LogOut
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
