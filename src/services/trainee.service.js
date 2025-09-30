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

            const { data } = await api.post('trainee/openai/analyze-voice', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });

            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    }
    
}

export default traineeService;