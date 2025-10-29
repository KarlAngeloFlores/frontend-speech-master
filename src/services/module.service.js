import { get } from "../../../backend/routes/module.routes";
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

  getModuleHistory: async (id) => {
    try {
      const { data } = await api.get(`/module/history/${id}`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },

  createModule: async (title, category) => {
    try {
      const { data } = await api.post("/module", { title, category });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },

  updateModule: async (id, title, category) => {
    try {
      const { data } = await api.patch("/module", { id, title, category });
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

  archiveModule: async (id) => {
    try {
      const { data } = await api.patch(`/module/archive/${id}`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  },

  restoreModule: async (id) => {
    try {
      const { data } = await api.patch(`/module/restore/${id}`);
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
