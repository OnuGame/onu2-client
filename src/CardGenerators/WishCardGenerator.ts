import { OnuCardColor, OnuTheme } from "../OnuTheme";
import { CardGenerator } from "./CardGenerator";

export class WishCardGenerator extends CardGenerator {
    constructor(theme: OnuTheme) {
        super("./assets/cards/WishCard.svg", theme);
    }

    generate(options: {
        drawAmount?: number;
        color?: OnuCardColor;
        isRandomColor?: boolean;
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
        const green = card.querySelector("#green");
        const blue = card.querySelector("#blue");
        const yellow = card.querySelector("#yellow");

        red!.setAttribute("fill", this.theme.cards[options.color!] || this.theme.cards.r);
        green!.setAttribute("fill", this.theme.cards[options.color!] || this.theme.cards.g);
        blue!.setAttribute("fill", this.theme.cards[options.color!] || this.theme.cards.b);
        yellow!.setAttribute("fill", this.theme.cards[options.color!] || this.theme.cards.y);

        const upperRandom = card.querySelector("#urd");
        const lowerRandom = card.querySelector("#lrd");
        if (!options.isRandomColor) {
            upperRandom!.remove();
            lowerRandom!.remove();
        } else {
            upperRandom!.querySelectorAll("*").forEach((elm) => {
                if (elm.id.includes("question"))
                    elm.setAttribute("fill", this.theme.cards.background);
                if (elm.id.includes("outline")) elm.setAttribute("fill", this.theme.cards.main);
                if (elm.id.includes("red")) elm.setAttribute("fill", this.theme.cards.r);
                if (elm.id.includes("green")) elm.setAttribute("fill", this.theme.cards.g);
                if (elm.id.includes("blue")) elm.setAttribute("fill", this.theme.cards.b);
                // if (elm.id.includes("yellow")) elm.setAttribute("fill", this.theme.cards.y); // there are no yellow dots in the random color svg

                if (elm.id.includes("cube")) elm.setAttribute("fill", this.theme.cards.background);
            });
            lowerRandom!.querySelectorAll("*").forEach((elm) => {
                if (elm.id.includes("question"))
                    elm.setAttribute("fill", this.theme.cards.background);
                if (elm.id.includes("outline")) elm.setAttribute("fill", this.theme.cards.main);
                if (elm.id.includes("red")) elm.setAttribute("fill", this.theme.cards.r);
                if (elm.id.includes("green")) elm.setAttribute("fill", this.theme.cards.g);
                if (elm.id.includes("blue")) elm.setAttribute("fill", this.theme.cards.b);
                // if (elm.id.includes("yellow")) elm.setAttribute("fill", this.theme.cards.y); // there are no yellow dots in the random color svg

                if (elm.id.includes("cube")) elm.setAttribute("fill", this.theme.cards.background);
            });
        }

        const upperPlus = card.querySelector("#upper_plus");
        const lowerPlus = card.querySelector("#lower_plus");

        upperPlus!.setAttribute("fill", this.theme.cards.background);
        lowerPlus!.setAttribute("fill", this.theme.cards.background);
        if (!options.drawAmount) upperPlus!.remove();
        if (!options.drawAmount) lowerPlus!.remove();

        const upperNumbers = card.querySelectorAll("#small_numbers > #upper *");
        const lowerNumbers = card.querySelectorAll("#small_numbers > #lower *");
        upperNumbers.forEach((upperNumber) => {
            upperNumber.setAttribute("fill", this.theme.cards.background);
            upperNumber.setAttribute("style", "display: none");
        });
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
