import HabitoUIFactory from "./HabitoUIFactory";

export default class SaludFactory extends HabitoUIFactory {
  getCardClass() {
    return "card tarjeta-habito tarjeta-salud";
  }

  getBadgeClass() {
    return "etiqueta-categoria categoria-salud";
  }

  getCardStyle() {
    return { borderLeft: "6px solid #0d6efd" };
  }
}
