import http from "../http-common";

class SkillDataService {
  getAll() {
    return http.get("/skills");
  }

  get(id) {
    return http.get(`/skills/${id}`);
  }

  create(data) {
    return http.post("/skills", data);
  }

  update(id, data) {
    return http.put(`/skills/${id}`, data);
  }

  delete(id) {
    return http.delete(`/skills/${id}`);
  }

  deleteAll() {
    return http.delete(`/skills`);
  }

  findByTitle(title) {
    return http.get(`/skills?title=${title}`);
  }

  findByUserId(userId) {
    return http.get(`/skills?userId=${userId}`);
  }
}

export default new SkillDataService();
