import api from './api.service';

const traineeService = {

    /**
     * @SCRIPT_PRACTICE
     */
    generateScript: async (topic) => {
        try {
            
            const { data } = await api.post('/trainee/openai/generate-script', { topic });
            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },
    analyzeVoice: async (audioBlob, script) => {
        try {
            
            const formData = new FormData();
            formData.append("audio", audioBlob, "speech.webm");
            formData.append("script", script);

            const { data } = await api.post('/trainee/openai/analyze-voice', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });

            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },

    /**
     * @HOME_PAGE_OR_QUIZ
     */

    getHome: async () => {
        try {
            
            const { data } = await api.get("/trainee/home");
            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg);
        }
    },
    
    /**
     * @DICTIONARY_PROXY
     */

    dictionaryProxy: async (word) => {
        try {
            const { data } = await api.get(`/trainee/dictionary/${word}`);
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg);
        }
    },

    alternativeDictionary: async (word) => {
        try {
            const { data } = await api.get(`/trainee/alternative-dictionary/${word}`);
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg);
        }
    },
    
}

export default traineeService;