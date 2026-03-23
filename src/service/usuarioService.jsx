// src/service/usuarioService.jsx
import API from "./api";

export const iniciarSesion = async (correo, contrasena) => {
    try {
        const response = await API.post("/IniciarSesion", {
            correo: correo,
            contrasena: contrasena
        });
        
        return {
            success: true,
            data: response.data,
            message: response.data.message
        };
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data.message || "Error en el servidor",
                status: error.response.status
            };
        } else if (error.request) {
            return {
                success: false,
                message: "No se pudo conectar con el servidor"
            };
        } else {
            return {
                success: false,
                message: error.message || "Error al realizar la petición"
            };
        }
    }
};