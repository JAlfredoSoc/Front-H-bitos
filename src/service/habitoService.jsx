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