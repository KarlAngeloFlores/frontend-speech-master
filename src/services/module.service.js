import api from "./api.service";

const moduleService = {
  /**
   * =======================
   * MODULE CRUD
   * =======================
   */
  getModules: async () => {
    try {
      const { data } = await api.get("/module");
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },

  getModule: async (id, content) => {
    try {
      const { data } = await api.get(`/module/${id}/${content}`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },

  createModule: async (title) => {
    try {
      const { data } = await api.post("/module", { title });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },

  updateModule: async (id, title) => {
    try {
      const { data } = await api.patch("/module", { id, title });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },

  deleteModule: async (id) => {
    try {
      const { data } = await api.delete(`/module/${id}`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },

  /**
   * =======================
   * FILE CRUD
   * =======================
   */
  getFiles: async (moduleId) => {
    try {
      const { data } = await api.get(`/module/${moduleId}/files`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },

getFileBlob: async (id) => {
  try {
    const { data } = await api.get(`/module/files/single/${id}`, {
      responseType: "blob", // important!
    });
    return data; // this is a Blob
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    throw new Error(msg);
  }
},

  insertFile: async (moduleId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post(`/module/${moduleId}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },

  deleteFile: async (id) => {
    try {
      const { data } = await api.delete(`/module/files/${id}`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },
};

export default moduleService;
