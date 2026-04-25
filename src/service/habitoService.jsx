// src/service/sugerenciasService.jsx
import API from "./api";

export const getObtenerSugerencias = async () => {
  try {
    const res = await API.get(`/ObtenerSugerencias`);
    console.log("Respuesta del servidor:", res.data);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Error al obtener sugerencias:", error);
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || "Error al obtener sugerencias",
        status: error.response.status,
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
      message: "Hábito creado exitosamente",
    };
  } catch (error) {
    console.error("Error al crear hábito:", error);

    if (error.response) {
      // El servidor respondió con un error
      return {
        success: false,
        message: error.response.data.message || "Error al crear el hábito",
        status: error.response.status,
        error: error.response.data,
      };
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      return {
        success: false,
        message: "No se pudo conectar con el servidor. Verifica tu conexión.",
      };
    } else {
      // Algo pasó al configurar la petición
      return {
        success: false,
        message: error.message || "Error al realizar la petición",
      };
    }
  }
};

export const actualizarProgreso = async (habitoId, usuarioId) => {
  try {
    const res = await API.put(`/ActualizarProgreso/${habitoId}`, {
      usuarioId // 👈 ahora sí lo mandas
    });

    return {
      success: true,
      data: res.data,
      message: "Progreso actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar progreso:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Error al actualizar progreso",
    };
  }
};

export const obtenerHabitosUsuario = async (usuarioID) => {
  try {
    const res = await API.get(`/ObtenerHabitos/${usuarioID}`);

    console.log("=== EN USUARIO SERVICE ===");
    console.log("res.data:", res.data);
    console.log("res.data.data:", res.data.data);
    console.log(
      "Primer hábito con notificaciones:",
      res.data.data?.[0]?.notificaciones,
    );
    return {
      success: true,
      data: res.data.data,
      message: "Hábitos obtenidos exitosamente",
    };
  } catch (error) {
    console.error("Error al obtener hábitos:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener hábitos",
    };
  }
};

// PARA APLICAR EL PROTOTYPE
export const clonarHabito = async (habitoId, usuarioId) => {
  try {
    console.log("Clonando hábito con ID:", habitoId); // Debug
    
    // Usar API.post correctamente (API es tu instancia de axios)
    const response = await API.post(`/clonar/${habitoId}`,{
        usuarioId
    });
    
    console.log("Respuesta del servidor:", response.data); // Debug
    
    return {
      success: true,
      data: response.data,
      message: "Hábito clonado exitosamente"
    };
  } catch (error) {
    console.error("Error en clonarHabito:", error);
    
    if (error.response) {
      // El servidor respondió con un error
      return {
        success: false,
        message: error.response.data.message || "Error al clonar el hábito",
        status: error.response.status,
      };
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      return {
        success: false,
        message: "No se pudo conectar con el servidor. Verifica tu conexión.",
      };
    } else {
      // Algo pasó al configurar la petición
      return {
        success: false,
        message: error.message || "Error al realizar la petición",
      };
    }
  }
};

export const editarHabito = async (habitoId, habitoData) => {
  try {
    const response = await API.put(`/editar/${habitoId}`, habitoData);

    return {
      success: true,
      data: response.data.data, // 🔥 SOLO el hábito
      message: response.data.message,
    };

  } catch (error) {
    console.error("Error al editar hábito:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Error al editar el hábito",
    };
  }
};
