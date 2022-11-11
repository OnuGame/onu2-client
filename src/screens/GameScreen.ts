import { Card, UpdateDeckEvent } from "@lebogo/onu2-shared";
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
    constructor(private baseGame: BaseGame) {
        super("gameScreen");
        console.log("new onu game created");
        this.registerEvents();

        this.populateDrawstack();
    }

    populateDrawstack() {
        const drawStack = document.querySelector("#drawstack") as HTMLDivElement;
        const maxAngle = 20;

        // create 10 cards for drawstack
        for (let i = 0; i < 10; i++) {
            const cardImage = document.createElement("img");
            cardImage.src = `/assets/cards/cardback.png`;
            cardImage.classList.add("card");
            cardImage.classList.add("stackCard");
            cardImage.classList.add(this.theme);
            cardImage.style.transform = `rotate(${Math.random() * maxAngle - maxAngle / 2}deg)`;
            drawStack.appendChild(cardImage);
        }

        drawStack.onclick = this.drawClicked;
    }

    drawClicked() {
        console.log("drawing cards");
        // get top most card of drawstack (last child of drawstack)
        const drawStack = document.querySelector("#drawstack") as HTMLDivElement;
        const card = drawStack.lastChild as HTMLImageElement;
        console.log(card);

        card.classList.add("drawTurn");

        setTimeout(() => {
            // move card to first element of drawstack and remove drawTurn class
            drawStack.prepend(card);
            card.classList.remove("drawTurn");
        }, 1000);
    }

    cardClcked(card: Card) {
        console.log("Card clicked");
        console.log(card);
    }

    renderCards() {
        // sort cards
        this.baseGame.deck = sortCards(this.baseGame.deck);

        // create card imgs for each card in deck
        for (const card of this.baseGame.deck) {
            const cardImage = document.createElement("img");
            cardImage.src = `/assets/cards/${card.type}.png`;
            cardImage.classList.add("card");
            cardImage.classList.add("hoverable");
            cardImage.classList.add(this.theme);
            cardImage.style.backgroundImage = `url(/assets/cards/${card.color.color}.png)`;
            cardImage.addEventListener("click", () => {
                this.cardClcked(card);
            });
            document.getElementById("deck")?.appendChild(cardImage);
        }
        console.log(this.baseGame.deck);
    }

    registerEvents() {
        const connection = this.baseGame.connection;

        connection.registerEvent<UpdateDeckEvent>("UpdateDeckEvent", ({ deck }) => {
            this.baseGame.deck = deck;
            this.renderCards();
        });

        this.renderCards();
    }
}
