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

export const registrarUsuario = async (nombre, correo, contrasena, edad, telefono) => {
    try {
        const response = await API.post("/RegistroUsuario", {
            nombre: nombre,
            correo: correo,
            contrasena: contrasena,
            edad: edad,
            telefono: telefono
        });

        console.log("Respuesta del servidor:", response.data);
        
        return {
            success: true,
            data: response.data,
            message: "Usuario registrado exitosamente"
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

export const obtenerHabitosUsuario = async (usuarioId) => {
    try {
        const res = await API.get(`/usuario/${usuarioId}/habitos`);
        console.log("Hábitos del usuario:", res.data.data) // Para debug
        return {
            success: true,
            data: res.data.data, 
        };
    } catch (error) {
        console.error("Error al obtener hábitos del usuario:", error);

        return {
            success: false,
            message: error.response?.data?.message || "Error al obtener hábitos"
        };
    } 
};

export const estadisticasUsuario = async (usuarioId) => {
    try {
        const res = await API.get(`/estadisticas/${usuarioId}`);
        return res.data;
    } catch (error) {
        console.error("Error obteniendo estadísticas:", error);
        throw error;
    }
};