import React from "react";

export default class HabitoUIFactory {
  getCardClass() {
    return "card tarjeta-habito";
  }

  getBadgeClass() {
    return "etiqueta-categoria categoria-general";
  }

  getProgressBarClass() {
    return "progress-bar";
  }

  getCardStyle() {
    return {};
  }

  renderContainer(content) {
    return React.createElement(
      "div",
      { className: this.getCardClass(), style: this.getCardStyle() },
      content
    );
  }
}
