import {
    Card,
    CardColor,
    CardColorType,
    CardPlacedEvent,
    CardRequestEvent,
    ColorWishEvent,
    GameOverEvent,
    PlayerDoneEvent,
    PlayerTurnEvent,
    UpdateColorEvent,
    UpdateDeckEvent,
    UpdateDrawAmountEvent,
    UpdatePlayerlistEvent,
} from "@lebogo/onu2-shared";
import { CardBackGenerator } from "../CardGenerators/CardBackGenerator";
import { CardGenerator } from "../CardGenerators/CardGenerator";
import { ColorCardGenerator } from "../CardGenerators/ColorCardGenerator";
import { WishCardGenerator } from "../CardGenerators/WishCardGenerator";
import { BaseGame } from "../main";
import Themes from "../Themes";
import { OnuScreen } from "./OnuScreen";

function sortCards(cards: Card[]) {
    const rCards = cards
        .filter((card) => card.color.color === "r")
        .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
    const gCards = cards
        .filter((card) => card.color.color === "g")
        .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
    const tCards = cards
        .filter((card) => card.color.color === "c")
        .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
    const bCards = cards
        .filter((card) => card.color.color === "b")
        .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
    const lCards = cards
        .filter((card) => card.color.color === "p")
        .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
    const yCards = cards
        .filter((card) => card.color.color === "y")
        .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
    const etcCards = cards
        .filter((card) => card.color.color === null)
        .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));

    return rCards
        .concat(gCards)
        .concat(tCards)
        .concat(bCards)
        .concat(lCards)
        .concat(yCards)
        .concat(etcCards);
}

export class GameScreen extends OnuScreen {
    private wishCardGenerator: WishCardGenerator;
    private cardBackGenerator: CardBackGenerator;
    private colorCardGenerator: ColorCardGenerator;

    private maxAngle = 20;
    constructor(private baseGame: BaseGame) {
        super("gameScreen");

        this.wishCardGenerator = new WishCardGenerator(Themes[this.theme]);
        this.cardBackGenerator = new CardBackGenerator(Themes[this.theme]);
        this.colorCardGenerator = new ColorCardGenerator(Themes[this.theme]);

        this.initialize();
    }

    setActive(): void {
        super.setActive();
        this.populateDrawstack();
    }

    setTheme(theme: string) {
        super.setTheme(theme);
        this.wishCardGenerator.setTheme(Themes[this.theme]);
        this.cardBackGenerator.setTheme(Themes[this.theme]);
        this.colorCardGenerator.setTheme(Themes[this.theme]);
    }

    populateDrawstack() {
        const drawStack = document.querySelector("#drawstack") as HTMLDivElement;

        drawStack.innerHTML = "";
        const cardBack = this.cardBackGenerator.generate();

        // create 40 cards for drawstack
        for (let i = 0; i < 40; i++) {
            let cardBackCopy = cardBack.cloneNode(true) as HTMLElement;
            cardBackCopy.classList.add("card");
            cardBackCopy.classList.add("stackCard");
            cardBackCopy.style.transform = `rotate(${
                Math.random() * this.maxAngle - this.maxAngle / 2
            }deg)`;
            drawStack.appendChild(cardBackCopy);
        }

        drawStack.onclick = this.drawClicked.bind(this);
    }

    updateTopCard(newOptions: { [key: string]: any }) {
        const stack = document.querySelector("#stack") as HTMLDivElement;
        const topCardElement = stack.children[stack.childElementCount - 1] as HTMLElement;

        // get rotation of top card
        const rotation = topCardElement.style.transform;
        let options = { ...JSON.parse(topCardElement.getAttribute("options")!), ...newOptions };

        // get card generator from card attributes
        let cardGenerator = topCardElement.getAttribute("generator");
        let generator: CardGenerator | null = null;
        if (cardGenerator === "ColorCardGenerator") {
            generator = this.colorCardGenerator;
        } else if (cardGenerator === "WishCardGenerator") {
            generator = this.wishCardGenerator;
        }

        if (!generator) return;

        const cardSvg = generator.generate(options);
        cardSvg.classList.add("stackCard");
        cardSvg.style.transform = rotation;

        cardSvg.setAttribute("options", JSON.stringify(options));

        console.log("updateTopCard generator name:", generator.constructor.name);
        cardSvg.setAttribute("generator", cardGenerator || "");

        // replace the top card with the new one
        topCardElement.replaceWith(cardSvg);
    }

    drawClicked() {
        // send draw event to server
        this.baseGame.connection.send(new CardRequestEvent());
    }

    cardClicked(card: Card) {
        this.baseGame.connection.send(new CardPlacedEvent(card));
    }

    renderCards() {
        // sort cards
        this.baseGame.deck = sortCards(this.baseGame.deck);

        // clear all cards in current deck
        const deckElement = document.getElementById("deck") as HTMLDivElement;
        deckElement.innerHTML = "";

        // create card imgs for each card in deck
        for (const card of this.baseGame.deck) {
            let generator: CardGenerator = this.colorCardGenerator;

            if (["p2", "p4", "w"].includes(card.type)) generator = this.wishCardGenerator;
            let drawAmount = card.type.startsWith("p") ? parseInt(card.type.replace("p", "")) : 0;
            let options = {
                drawAmount,
                type: card.type,
                color: card.color.color,
            };

            const cardSvg = generator.generate(options);
            cardSvg.classList.add("hoverable");
            cardSvg.setAttribute("id", card.id);
            cardSvg.setAttribute("generator", generator.constructor.name);

            const isCompatible = this.baseGame.topCard?.compare(card);
            const isPlayersTurn = this.baseGame.isTurn;
            const drawCard = this.baseGame.drawAmount > 1 && ["p2", "p4"].includes(card.type);
            if (isCompatible && isPlayersTurn && (drawCard || this.baseGame.drawAmount === 1)) {
                cardSvg.onclick = this.cardClicked.bind(this, card);
            } else {
                cardSvg.classList.add("disabled");
            }

            deckElement.appendChild(cardSvg);
        }
    }

    async initialize() {
        const connection = this.baseGame.connection;

        await this.cardBackGenerator.load();
        await this.colorCardGenerator.load();
        await this.wishCardGenerator.load();

        connection.registerEvent<UpdatePlayerlistEvent>(
            "UpdatePlayerlistEvent",
            ({ playerlist }) => {
                const playerList = document.getElementById("ingamePlayerlist") as HTMLUListElement;
                playerList.innerHTML = "";
                playerlist.forEach(({ username, active, cardCount, spectating }) => {
                    const playerListEntry = document.createElement("li");
                    playerListEntry.classList.add("playerlistItem");

                    const usernameText = document.createElement("b");
                    usernameText.classList.add("playerListUsernameText");
                    usernameText.innerText = username;
                    if (active) usernameText.classList.add("active");
                    playerListEntry.appendChild(usernameText);

                    if (!spectating) {
                        const cardCountText = document.createElement("span");
                        cardCountText.innerText = `: ${cardCount}`;
                        playerListEntry.appendChild(cardCountText);
                    } else {
                        const spectatingText = document.createElement("span");
                        spectatingText.innerText = " (spectating)";
                        playerListEntry.appendChild(spectatingText);
                        playerListEntry.classList.add("spectating");
                    }

                    playerList.appendChild(playerListEntry);
                });
            }
        );

        connection.registerEvent<UpdateDeckEvent>("UpdateDeckEvent", ({ deck }) => {
            // convert each card entry to a real card object with a color object instead of a normal object
            this.baseGame.deck = deck.map((card) => {
                card.color = new CardColor(card.color.color);
                let tempCard = new Card(card.type, card.color);
                Object.assign(tempCard, card);
                return tempCard;
            });

            this.baseGame.deck = deck;
        });

        connection.registerEvent<UpdateDrawAmountEvent>(
            "UpdateDrawAmountEvent",
            ({ drawAmount }) => {
                this.baseGame.drawAmount = drawAmount;
                if (drawAmount == 1) drawAmount = 0;

                this.updateTopCard({ drawAmount });
            }
        );

        connection.registerEvent<PlayerDoneEvent>("PlayerDoneEvent", ({ uuid }) => {
            if (uuid === this.baseGame.uuid) {
                let plingSound = document.createElement("audio");
                plingSound.src = "/assets/sounds/won.wav";
                plingSound.play();
                plingSound.addEventListener("ended", () => {
                    plingSound.remove();
                });
            }
        });

        connection.registerEvent<CardRequestEvent>("CardRequestEvent", () => {
            // get the last child of drawstack that does not have the drawTurn class applied
            const drawStack = document.querySelector("#drawstack") as HTMLDivElement;
            const drawStackChildren = drawStack.children;
            let topMost: HTMLElement | null = null;
            for (let i = drawStackChildren.length - 1; i >= 0; i--) {
                const child = drawStackChildren[i] as HTMLElement;
                if (!child.classList.contains("drawTurn")) {
                    topMost = child;
                    break;
                }
            }

            topMost!.classList.add("drawTurn");

            setTimeout(() => {
                // move card to first element of drawstack and remove drawTurn class
                drawStack.prepend(topMost!);
                topMost!.classList.remove("drawTurn");
            }, 1000);
        });

        connection.registerEvent<ColorWishEvent>("ColorWishEvent", () => {
            (document.querySelector("#cs-container") as HTMLDivElement).style.display = "grid";
        });

        document.querySelectorAll(".cs").forEach((element) => {
            element.addEventListener("click", () => {
                connection.send(new ColorWishEvent(element.id as CardColorType));
                (document.querySelector("#cs-container") as HTMLDivElement).style.display = "none";
            });
        });

        connection.registerEvent<PlayerTurnEvent>("PlayerTurnEvent", ({ uuid }) => {
            this.baseGame.isTurn = uuid === this.baseGame.uuid;

            if (this.baseGame.isTurn) {
                let plingSound = document.createElement("audio");
                plingSound.src = "/assets/sounds/pling.wav";
                plingSound.play();
                plingSound.addEventListener("ended", () => {
                    plingSound.remove();
                });
            }
            this.renderCards();
        });

        connection.registerEvent<UpdateColorEvent>("UpdateColorEvent", ({ color }) => {
            this.baseGame.topCard!.color.color = color.color;

            this.updateTopCard({ color: color.color });
        });

        connection.registerEvent<CardPlacedEvent>("CardPlacedEvent", ({ card }) => {
            // convert card to a real card object with a color object instead of a normal object
            card.color = new CardColor(card.color.color);
            let tempCard = new Card(card.type, card.color);
            Object.assign(tempCard, card);

            // add card to the stack
            this.baseGame.topCard = tempCard;

            // add the card to the stack
            const stackElement = document.getElementById("stack")!;

            let generator: CardGenerator = this.colorCardGenerator;

            if (["p2", "p4", "w"].includes(card.type)) generator = this.wishCardGenerator;

            let drawAmount = card.type.startsWith("p")
                ? (this.baseGame.drawAmount == 1 ? 0 : this.baseGame.drawAmount) +
                  parseInt(card.type.replace("p", ""))
                : 0;

            let options = {
                drawAmount,
                type: card.type,
                color: card.color.color,
            };

            const cardSvg = generator.generate(options);
            cardSvg.classList.add("stackCard");
            cardSvg.setAttribute("id", card.id);
            cardSvg.setAttribute("options", JSON.stringify(options));

            console.log("CardPlacedEvent generator name:", generator.constructor.name);
            cardSvg.setAttribute("generator", generator.constructor.name);

            cardSvg.style.transform = `rotate(${
                Math.random() * this.maxAngle - this.maxAngle / 2
            }deg)`;

            stackElement.appendChild(cardSvg);

            // remove old cards from stack (only keep the last 10)
            const stackChildren = stackElement.children;
            if (stackChildren.length > 10) {
                for (let i = 0; i < stackChildren.length - 10; i++) {
                    stackChildren[i].remove();
                }
            }

            // remove card from deck if it exists
            this.baseGame.deck = this.baseGame.deck.filter((c) => c.id !== card.id);

            this.renderCards();
        });

        connection.registerEvent<GameOverEvent>("GameOverEvent", ({}) => {
            this.baseGame.screenManager.setActiveScreen("lobbyScreen");
        });
    }
}
