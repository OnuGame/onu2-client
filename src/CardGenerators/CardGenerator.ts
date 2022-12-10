import { OnuTheme } from "../OnuTheme";

export class CardGenerator {
    protected baseCard!: HTMLElement;
    constructor(private baseCardName: string, protected theme: OnuTheme) {}

    async load() {
        const textSvg = await fetch(this.baseCardName).then((res) => res.text());

        let baseSVG = new DOMParser().parseFromString(textSvg, "image/svg+xml").documentElement;

        console.log(`Loaded ${this.baseCardName}`);

        this.baseCard = baseSVG;
    }

    setTheme(theme: OnuTheme) {
        this.theme = theme;
    }

    generate(options?: { [key: string]: any }): HTMLElement {
        const card = this.baseCard.cloneNode(true) as HTMLElement;
        card.querySelectorAll("*").forEach((element) => element.setAttribute("class", ""));

        card.classList.add("card");

        const border = card.querySelector("#border");
        border!.setAttribute("fill", this.theme.cards.border);

        const background = card.querySelector("#background");
        background!.setAttribute("fill", this.theme.cards.background);

        return card;
    }
}
