import api from "./api.service";

const quizTraineeService = {

    answerQuiz: async (quiz_id, score, taken_at, started_at, completed_at) => {
        try {
            
            const { data } = await api.post('/trainee/quizzes/answer-pending', {
                quiz_id, score, taken_at, started_at, completed_at
            });

            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },
    
    submitQuiz: async (quiz_id) => {
        try {

            const { data } = await api.patch('/trainee/quizzes/answer-completed', {
                quiz_id
            });
            
            return data;
            
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },

    getQuiz: async (id) => {
        try {
            
            const { data } = await api.get(`/trainee/quizzes/${id}`);
            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },
    
    getQuizzes: async () => {
        try {
            
            const { data } = await api.get("/trainee/quizzes/not-answered");
            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },

    getAnsweredQuizzes: async () => {
        try {
            
            const { data } = await api.get("/trainee/quizzes/answered");
            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    }
}

export default quizTraineeService;