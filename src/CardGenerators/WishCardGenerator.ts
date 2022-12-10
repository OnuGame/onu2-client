import { CardThemeName, OnuCardColor, OnuTheme } from "../OnuTheme";
import { CardGenerator } from "./CardGenerator";

export class WishCardGenerator extends CardGenerator {
    constructor(theme: OnuTheme) {
        super("./assets/cards/WishCard.svg", theme);
    }

    // { cardAmount: 13, color: "red" }
    generate(options: {
        drawAmount?: number;
        color?: OnuCardColor;
        theme: CardThemeName;
    }): HTMLElement {
        const card = super.generate(options);

        const topColor = card.querySelector("#top_color");
        topColor!.setAttribute("fill", this.theme.cards[options.color!] || this.theme.cards.main);

        const bottomColor = card.querySelector("#bottom_color");
        bottomColor!.setAttribute(
            "fill",
            this.theme.cards[options.color!] || this.theme.cards.main
        );

        const blackCardsOutline = card.querySelector("#black_cards_outline");
        blackCardsOutline!.setAttribute("fill", this.theme.cards.main);

        const whiteOutline = card.querySelector("#white_outline");
        whiteOutline!.setAttribute("fill", this.theme.cards.background);

        const red = card.querySelector("#red");
        red!.setAttribute("fill", this.theme.cards[options.color!] || this.theme.cards.r);

        const green = card.querySelector("#green");
        green!.setAttribute("fill", this.theme.cards[options.color!] || this.theme.cards.g);

        const blue = card.querySelector("#blue");
        blue!.setAttribute("fill", this.theme.cards[options.color!] || this.theme.cards.b);

        const yellow = card.querySelector("#yellow");
        yellow!.setAttribute("fill", this.theme.cards[options.color!] || this.theme.cards.y);

        const upperPlus = card.querySelector("#upper_plus");
        upperPlus!.setAttribute("fill", this.theme.cards.background);
        if (!options.drawAmount) upperPlus!.remove();

        const lowerPlus = card.querySelector("#lower_plus");
        lowerPlus!.setAttribute("fill", this.theme.cards.background);
        if (!options.drawAmount) lowerPlus!.remove();

        const upperNumbers = card.querySelectorAll("#small_numbers > #upper *");
        upperNumbers.forEach((upperNumber) => {
            upperNumber.setAttribute("fill", this.theme.cards.background);
            upperNumber.setAttribute("style", "display: none");
        });
        const lowerNumbers = card.querySelectorAll("#small_numbers > #lower *");
        lowerNumbers.forEach((lowerNumber) => {
            lowerNumber.setAttribute("fill", this.theme.cards.background);
            lowerNumber.setAttribute("style", "display: none");
        });

        if (options.drawAmount) {
            const drawAmount = options.drawAmount.toString();
            for (let i = 0; i < drawAmount.length; i++) {
                const digit = drawAmount[i];
                const upperDigitElement = card
                    .querySelector(`#small_numbers > #upper > #u${digit}`)!
                    .cloneNode(true) as HTMLElement;
                const lowerDigitElement = card
                    .querySelector(`#small_numbers > #lower > #l${digit}`)!
                    .cloneNode(true) as HTMLElement;

                upperDigitElement.removeAttribute("style");
                lowerDigitElement.removeAttribute("style");

                upperDigitElement.setAttribute("transform", `translate(${i * 45}, 0)`);
                lowerDigitElement.setAttribute("transform", `translate(${i * -45}, 0)`);

                card.querySelector("#small_numbers > #upper")!.appendChild(upperDigitElement);
                card.querySelector("#small_numbers > #lower")!.appendChild(lowerDigitElement);
            }
        }

        card.querySelectorAll("[style='display: none']").forEach((element) => element.remove());

        return card;
    }
}
