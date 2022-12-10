import { OnuTheme } from "../OnuTheme";
import { CardGenerator } from "./CardGenerator";

export class CardBackGenerator extends CardGenerator {
    constructor(protected theme: OnuTheme) {
        super("./assets/cards/CardBack.svg", theme);
    }

    generate(): HTMLElement {
        const card = super.generate();

        const background = card.querySelector("#background");
        background!.setAttribute("fill", this.theme.cards.white);

        const border = card.querySelector("#border");
        border!.setAttribute("fill", this.theme.cards.black);

        const backColor = card.querySelector("#black_blob");
        backColor!.setAttribute("fill", this.theme.cards.black);

        const redBlob = card.querySelector("#red_blob");
        redBlob!.setAttribute("fill", this.theme.cards.r);

        const yellowElements = [
            card.querySelector("#O_y"),
            card.querySelector("#U_y"),
            card.querySelector("#N_y"),
        ];

        yellowElements.forEach((element) => {
            element?.setAttribute("fill", this.theme.cards.y);
        });

        const shadowElements = [
            card.querySelector("#O_b"),
            card.querySelector("#U_b"),
            card.querySelector("#N_b"),
        ];

        shadowElements.forEach((element) => {
            element?.setAttribute("fill", this.theme.cards.black);
        });

        return card;
    }
}
