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