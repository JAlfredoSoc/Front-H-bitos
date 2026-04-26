// MOCK TEMPORAL - Solo para desarrollo. Eliminar cuando el backend esté disponible.

const historialMock = [
  {
    _id: "mock-001",
    accion: "CREADO",
    detalle: "Se creó el hábito correctamente.",
    fecha: "2026-04-01T08:30:00.000Z",
    habito: {
      nombre: "Ejercicio matutino",
      descripcion: "30 minutos de cardio cada mañana",
    },
  },
  {
    _id: "mock-002",
    accion: "PROGRESO_ACTUALIZADO",
    detalle: "Progreso actualizado al 50%.",
    fecha: "2026-04-05T10:15:00.000Z",
    habito: {
      nombre: "Ejercicio matutino",
      descripcion: "30 minutos de cardio cada mañana",
    },
  },
  {
    _id: "mock-003",
    accion: "COMPLETADO",
    detalle: "El hábito fue marcado como completado.",
    fecha: "2026-04-10T09:00:00.000Z",
    habito: {
      nombre: "Ejercicio matutino",
      descripcion: "30 minutos de cardio cada mañana",
    },
  },
  {
    _id: "mock-004",
    accion: "CREADO",
    detalle: "Se creó el hábito correctamente.",
    fecha: "2026-04-12T14:00:00.000Z",
    habito: {
      nombre: "Lectura diaria",
      descripcion: "Leer al menos 20 páginas por día",
    },
  },
  {
    _id: "mock-005",
    accion: "ELIMINADO",
    detalle: "El hábito fue eliminado por el usuario.",
    fecha: "2026-04-15T16:45:00.000Z",
    habito: null,
  },
  {
    _id: "mock-006",
    accion: "PROGRESO_ACTUALIZADO",
    detalle: "Progreso actualizado al 75%.",
    fecha: "2026-04-18T11:30:00.000Z",
    habito: {
      nombre: "Meditación",
      descripcion: "10 minutos de meditación antes de dormir",
    },
  },
  {
    _id: "mock-007",
    accion: "ELIMINADO",
    detalle: "Hábito eliminado. El registro ya no está disponible.",
    fecha: "2026-04-20T08:00:00.000Z",
    habito: null,
  },
  {
    _id: "mock-008",
    accion: "COMPLETADO",
    detalle: "El hábito fue marcado como completado.",
    fecha: "2026-04-24T20:00:00.000Z",
    habito: {
      nombre: "Hidratación",
      descripcion: "Tomar 8 vasos de agua al día",
    },
  },
];

export const obtenerHistorialUsuarioMock = (_idUsuario) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: historialMock,
      });
    }, 800);
  });
};
