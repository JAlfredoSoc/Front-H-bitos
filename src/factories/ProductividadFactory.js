import HabitoUIFactory from "./HabitoUIFactory";

export default class ProductividadFactory extends HabitoUIFactory {
  getCardClass() {
    return "card tarjeta-habito tarjeta-productividad";
  }

  getBadgeClass() {
    return "etiqueta-categoria categoria-productividad";
  }

  getCardStyle() {
    return { borderLeft: "6px solid #f59e0b" };
  }
}
