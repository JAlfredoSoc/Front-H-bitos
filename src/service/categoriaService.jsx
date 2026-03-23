import API from "./api";

export const obtenerCategorias = async () => {
  try {
    const res = await API.get("/ObtenerCategoria"); // ajusta la ruta si es diferente

    return {
      success: true,
      data: res.data.data, // 👈 porque tú envías { success, data }
    };
  } catch (error) {
    console.error("Error al obtener categorías:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener categorías",
    };
  }
};
