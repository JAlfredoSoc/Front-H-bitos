import API from "./api";

export const getObtenerSugerencias = async () => {
    try {
        const res = await API.get(`/ObtenerSugerencias`);
        console.log("Respuesta del servidor:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error al obtener hábitos:", error);
        throw error;
    }
}