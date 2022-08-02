import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SkillDataService from "../services/skill.service";
import ProjectDataService from "../services/project.service";
import authService from "../services/auth.service";

function GenerateInvoice() {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
}

class ResumeModal extends React.Component {
  constructor(props) {
    super(props);
    this.retrieveSkills = this.retrieveSkills.bind(this);
    this.retrieveProjects = this.retrieveProjects.bind(this);

    this.state = {
      skills: [],
      Projects: [],
      currentUser: authService.getCurrentUser(),
    };
  }

  componentDidMount() {
    this.retrieveSkills();
    this.retrieveProjects();
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

  render() {
    const { skills, projects } = this.state;

    return (
      <div id="invoiceCapture">
        <div className="container">
          <h4>Skills List</h4>
          <div className="row">
            {skills &&
              skills.map((skill, index) => (
                <div className="col-md-3">
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
                            index <= (skill.rating || this.state.rating)
                              ? "on"
                              : "off"
                          }
                        >
                          <span className="star">&#9733;</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
          <div className="col-md-12">
            <h4>Projects List</h4>
            <div className="row">
              {projects &&
                projects.map((project, index) => (
                  <div className="col-md-3">
                    <strong>{project.title}</strong>
                    <br></br>
                    <p>Skill</p>
                    {project.projectskill.map((item) => (
                      <span> {item.skillId}</span>
                    ))}
                  </div>
                ))}
            </div>
          </div>
          <button
            variant="outline-primary"
            className="btn btn-primary"
            onClick={GenerateInvoice}
          >
            Download Copy
          </button>
        </div>
      </div>
    );
  }
}

export default ResumeModal;
