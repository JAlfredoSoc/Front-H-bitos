export const calcularRacha = (historial, habitoId) => {
  if (!historial || historial.length === 0) return 0;

  // Filtrar registros del hábito
  const registrosHabito = historial
    .filter((h) => h.habitoId === habitoId)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  if (registrosHabito.length === 0) return 0;

  // Convertir fechas a YYYY-MM-DD
  const fechas = registrosHabito.map((r) =>
    new Date(r.fecha).toISOString().split("T")[0]
  );

  // Eliminar duplicados
  const fechasUnicas = [...new Set(fechas)];

  let racha = 0;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  for (let i = 0; i < fechasUnicas.length; i++) {
    const fechaRegistro = new Date(fechasUnicas[i]);
    fechaRegistro.setHours(0, 0, 0, 0);

    const diferenciaDias = Math.floor(
      (hoy - fechaRegistro) / (1000 * 60 * 60 * 24)
    );

    // Hoy
    if (i === 0 && diferenciaDias === 0) {
      racha++;
      hoy.setDate(hoy.getDate() - 1);
    }

    // Ayer, antier, etc consecutivos
    else if (diferenciaDias === racha) {
      racha++;
    }

    // Se rompió
    else {
      break;
    }
  }

  return racha;
};