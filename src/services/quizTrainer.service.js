import api from "./api.service";

const quizTrainerService = {

  createQuiz: async (type, title, total_points, timer_seconds, questions) => {
    try {
      const { data } = await api.post("/trainer/quizzes", { type, title, total_points, timer_seconds, questions });
      return data;
    } catch (error) {
        const msg = error.response?.data?.message || error.message;
        throw new Error(msg); 
    }
  },

  getQuizzes: async () => {
    try {
        const { data } = await api.get("/trainer/quizzes");
        return data;
    } catch (error) {
        const msg = error.response?.data?.message || error.message;
        throw new Error(msg); 
    }
  },

  deleteQuiz: async (id) => {
    try {

        const { data } = await api.delete(`/trainer/quizzes/${id}`);
        return data;
        
    } catch (error) {
        const msg = error.response?.data?.message || error.message;
        throw new Error(msg); 
    }
  },

  getQuizResult: async (id) => {
    try {
      
      const { data } = await api.get(`/trainer/quizzes/result/${id}`);
      return data;

    } catch (error) {
        const msg = error.response?.data?.message || error.message;
        throw new Error(msg); 
    }
  }
};

export default quizTrainerService;