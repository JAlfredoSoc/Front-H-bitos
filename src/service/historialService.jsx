import API from "./api";

export const obtenerHistorialUsuario = async (idUsuario) => {
    try {
        const response = await API.get(`/historial/${idUsuario}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo historial:", error);
        throw error;
    }
}