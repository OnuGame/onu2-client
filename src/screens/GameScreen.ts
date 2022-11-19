import {
    Card,
    CardColor,
    CardColorType,
    CardPlacedEvent,
    CardRequestEvent,
    ColorWishEvent,
    GameOverEvent,
    PlayerTurnEvent,
    UpdateDeckEvent,
    UpdateDrawAmountEvent,
    UpdatePlayerlistEvent,
} from "@lebogo/onu2-shared";
import { BaseGame } from "../main";
import { OnuScreen } from "./OnuScreen";

function sortCards(cards: Card[]) {
    const rCards = cards
        .filter((card) => card.color.color === "r")
        .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
    const gCards = cards
        .filter((card) => card.color.color === "g")
        .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
    const tCards = cards
        .filter((card) => card.color.color === "t")
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
        .filter((card) => card.color.color === "c")
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
    private maxAngle = 20;
    constructor(private baseGame: BaseGame) {
        super("gameScreen");
        this.registerEvents();
    }

    setActive(): void {
        super.setActive();
        this.populateDrawstack();
    }

    populateDrawstack() {
        const drawStack = document.querySelector("#drawstack") as HTMLDivElement;

        drawStack.innerHTML = "";

        // create 40 cards for drawstack
        for (let i = 0; i < 40; i++) {
            const cardImage = document.createElement("img");
            cardImage.src = `/assets/cards/cardback.png`;
            cardImage.classList.add("card");
            cardImage.classList.add("stackCard");
            cardImage.classList.add(this.theme);
            cardImage.style.transform = `rotate(${
                Math.random() * this.maxAngle - this.maxAngle / 2
            }deg)`;
            drawStack.appendChild(cardImage);
        }

        drawStack.onclick = this.drawClicked.bind(this);
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
            const cardImage = document.createElement("img");
            cardImage.src = `/assets/cards/${card.type}.png`;
            cardImage.classList.add("card");
            cardImage.classList.add("hoverable");
            cardImage.classList.add(this.theme);
            cardImage.style.backgroundImage = `url(/assets/cards/${card.color.color}.png)`;

            const isCompatible = this.baseGame.topCard?.compare(card);
            const isPlayersTurn = this.baseGame.isTurn;
            const drawCard = this.baseGame.drawAmount > 1 && ["p2", "p4"].includes(card.type);
            if (isCompatible && isPlayersTurn && (drawCard || this.baseGame.drawAmount === 1)) {
                cardImage.onclick = this.cardClicked.bind(this, card);
            } else {
                cardImage.classList.add("disabled");
            }

            deckElement.appendChild(cardImage);
        }
    }

    registerEvents() {
        const connection = this.baseGame.connection;

        connection.registerEvent<UpdatePlayerlistEvent>(
            "UpdatePlayerlistEvent",
            ({ playerlist }) => {
                console.log("UpdatePlayerlistEvent", playerlist);

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
            this.renderCards();
        });

        connection.registerEvent<UpdateDrawAmountEvent>(
            "UpdateDrawAmountEvent",
            ({ drawAmount }) => {
                this.baseGame.drawAmount = drawAmount;
                let displayAmount = drawAmount.toString();
                if (drawAmount === 1) displayAmount = ""; // if draw amount is 1, dont show it
                document.querySelector("#drawAmount")!.innerHTML = displayAmount;
            }
        );

        connection.registerEvent<CardRequestEvent>("CardRequestEvent", () => {
            // Drawing card was successful. Play card draw animation

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
            this.renderCards();
        });

        connection.registerEvent<CardPlacedEvent>("CardPlacedEvent", ({ card }) => {
            // convert card to a real card object with a color object instead of a normal object
            card.color = new CardColor(card.color.color);
            let tempCard = new Card(card.type, card.color);
            Object.assign(tempCard, card);

            // add card to the stack
            this.baseGame.topCard = tempCard;

            // add the card to the stack
            const stackElement = document.getElementById("stack") as HTMLDivElement;
            const cardImage = document.createElement("img");
            cardImage.src = `/assets/cards/${card.type}.png`;
            cardImage.classList.add("card");
            cardImage.classList.add("stackCard");
            cardImage.classList.add(this.theme);
            cardImage.style.backgroundImage = `url(/assets/cards/${card.color.color}.png)`;
            // apply random rotation to card
            cardImage.style.transform = `rotate(${
                Math.random() * this.maxAngle - this.maxAngle / 2
            }deg)`;

            cardImage.setAttribute("id", card.id);
            stackElement.appendChild(cardImage);

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
