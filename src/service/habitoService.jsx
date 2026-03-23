// src/service/sugerenciasService.jsx
import API from "./api";

export const getObtenerSugerencias = async () => {
    try {
        const res = await API.get(`/ObtenerSugerencias`);
        console.log("Respuesta del servidor:", res.data);
        return {
            success: true,
            data: res.data
        };
    } catch (error) {
        console.error("Error al obtener sugerencias:", error);
        if (error.response) {
            return {
                success: false,
                message: error.response.data.message || "Error al obtener sugerencias",
                status: error.response.status
            };
        }
    }
};

export const crearHabito = async (habitoData) => {
    try {
        console.log("Datos enviados:", habitoData);
        const response = await API.post("/CrearHabitos", habitoData);
        
        return {
            success: true,
            data: response.data,
            message: "Hábito creado exitosamente"
        };
    } catch (error) {
        console.error("Error al crear hábito:", error);
        
        if (error.response) {
            // El servidor respondió con un error
            return {
                success: false,
                message: error.response.data.message || "Error al crear el hábito",
                status: error.response.status,
                error: error.response.data
            };
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            return {
                success: false,
                message: "No se pudo conectar con el servidor. Verifica tu conexión."
            };
        } else {
            // Algo pasó al configurar la petición
            return {
                success: false,
                message: error.message || "Error al realizar la petición"
            };
        }
    }
};