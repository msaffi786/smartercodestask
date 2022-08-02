import http from "../http-common";

class ProjectDataService {
  getAll() {
    return http.get("/projects");
  }

  get(id) {
    return http.get(`/projects/${id}`);
  }

  create(data) {
    return http.post("/projects", data);
  }

  update(id, data) {
    return http.put(`/projects/${id}`, data);
  }

  delete(id) {
    return http.delete(`/projects/${id}`);
  }

  deleteAll() {
    return http.delete(`/projects`);
  }

  findByTitle(title) {
    return http.get(`/projects?title=${title}`);
  }
  findByUserId(userId) {
    return http.get(`/projects?userId=${userId}`);
  }
}

export default new ProjectDataService();
