import HabitoUIFactory from "./HabitoUIFactory";

export default class BienestarFactory extends HabitoUIFactory {
  getCardClass() {
    return "card tarjeta-habito tarjeta-bienestar";
  }

  getBadgeClass() {
    return "etiqueta-categoria categoria-bienestar";
  }

  getCardStyle() {
    return { borderLeft: "6px solid #198754" };
  }
}
