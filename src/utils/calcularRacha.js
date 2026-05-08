export const calcularRacha = (historial, habitoId) => {
  if (!historial || historial.length === 0) return 0;

  const registrosHabito = historial.filter(
    (item) =>
      String(item.habito?._id) === String(habitoId)
  );

  

  if (registrosHabito.length === 0) return 0;

  const fechasUnicas = [
    ...new Set(
      registrosHabito.map((item) =>
        new Date(item.fecha).toDateString()
      )
    ),
  ];

  

  const fechasOrdenadas = fechasUnicas
    .map((fecha) => new Date(fecha))
    .sort((a, b) => b - a);

  

  // 🔥 si solo hay un día registrado
  if (fechasOrdenadas.length === 1) {
    return 1;
  }

  let racha = 1;

  for (let i = 0; i < fechasOrdenadas.length - 1; i++) {
    const actual = fechasOrdenadas[i];
    const siguiente = fechasOrdenadas[i + 1];

    const diferenciaDias =
      (actual - siguiente) / (1000 * 60 * 60 * 24);

    if (diferenciaDias === 1) {
      racha++;
    } else {
      break;
    }
  }


  return racha;
};