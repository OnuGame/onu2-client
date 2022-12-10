import { OnuCardColor, OnuTheme } from "../OnuTheme";
import { CardGenerator } from "./CardGenerator";

export class ColorCardGenerator extends CardGenerator {
    constructor(protected theme: OnuTheme) {
        super("./assets/cards/ColorCard.svg", theme);
    }

    generate(options: { color: OnuCardColor; type: string }): HTMLElement {
        options.type = options.type.padStart(2, "_");
        let filled: boolean = options.type[0] == "_";

        const card = super.generate();

        const topColor = card.querySelector("#top_color");
        topColor!.setAttribute("fill", this.theme.cards[options.color!] || this.theme.cards.main);

        const bottomColor = card.querySelector("#bottom_color");
        bottomColor!.setAttribute(
            "fill",
            this.theme.cards[options.color!] || this.theme.cards.main
        );

        const cardTypes = card.querySelectorAll("#types > #big > * ");
        cardTypes.forEach((type) => {
            if (type.id === options.type) {
                type.setAttribute("fill", this.theme.cards[options.color]);
            } else {
                type.remove();
            }
        });

        const upperTypes = card.querySelectorAll("#types > #small > #upper > *");
        upperTypes.forEach((type) => {
            if (type.id.replace("u", filled ? "_" : "") === options.type) {
                type.setAttribute("fill", this.theme.cards.background);
            } else {
                type.remove();
            }
        });

        const lowerTypes = card.querySelectorAll("#types > #small > #lower > *");
        lowerTypes.forEach((type) => {
            if (type.id.replace("l", filled ? "_" : "") === options.type) {
                type.setAttribute("fill", this.theme.cards.background);
            } else {
                type.remove();
            }
        });

        return card;
    }
}
