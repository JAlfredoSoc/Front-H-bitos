import BienestarFactory from "./BienestarFactory";
import SaludFactory from "./SaludFactory";
import ProductividadFactory from "./ProductividadFactory";
import HabitoUIFactory from "./HabitoUIFactory";

const factoryMap = {
  bienestar: new BienestarFactory(),
  salud: new SaludFactory(),
  productividad: new ProductividadFactory(),
};

export function obtenerFactoryHabito(categoria) {
  const key = categoria?.toString().trim().toLowerCase();
  return factoryMap[key] || new HabitoUIFactory();
}
