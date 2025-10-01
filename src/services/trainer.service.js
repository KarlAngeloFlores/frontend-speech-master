import api from "./api.service";

const trainerService = {
    getTrainees: async () => {
        try {
            const { data } = await api.get('/trainer/trainees');
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },

    approveTrainee: async (id) => {
        try {
            const { data } = await api.patch(`/trainer/trainees/${id}/approve`);
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },

    getHome: async () => {
        try {
            const { data } = await api.get(`/trainer/home`);
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    }
}

export default trainerService;