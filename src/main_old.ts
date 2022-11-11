// import { Card, CardColor, CardColorType, CardType } from "../../OnuShared/src/Card";
// import { CardPlacedEvent } from "../../OnuShared/src/events/CardPlacedEvent";
// import { CardRequestEvent } from "../../OnuShared/src/events/CardRequestEvent";
// import { ConnectedEvent } from "../../OnuShared/src/events/ConnectedEvent";
// import { JoinEvent } from "../../OnuShared/src/events/JoinEvent";
// import { Connection } from "./Connection";

// import "./css/card.css";
// import "./css/deck.css";
// import "./css/stack.css";
// import "./css/style.css";

// const PORT = 3000;
// const darkMode = true;
// const connection = new Connection(`ws://${location.hostname}:${PORT}`);
// var cards: Card[] = [];
// var topCard: Card;
// var thisUser: { username: string; hash?: string; lobbyCode?: string };

// connection.registerEvent<ConnectedEvent>("ConnectedEvent", (_event) => {
//     connection.send(new OnuJoinEvent({ lobbyCode: "1234", username: "Leon" }));
// });

// connection.registerEvent<JoinEvent>("OnuJoinEvent", (event) => {
//     thisUser = event.data;
//     connection.send(new CardRequestEvent());
// });

// function createCardLayer(name: string): HTMLImageElement {
//     const layerImg = document.createElement("img");
//     layerImg.src = `/assets/cards/${name}.png`;
//     layerImg.classList.add("layer");
//     return layerImg;
// }

// function showCards() {
//     document.querySelector("#deck")!.innerHTML = "";

//     const cleanCards = cards.map((card) => {
//         return {
//             color: card.color.color,
//             type: card.type,
//             id: card.id,
//         };
//     });
//     const sortedCards = sortCards(cleanCards);

//     for (let card of sortedCards) {
//         const { color, type, id } = card;

//         const cardDiv = document.createElement("div");
//         cardDiv.classList.add("card");
//         cardDiv.classList.add("hoverable");

//         const colorImg = createCardLayer(color);
//         const typeImg = createCardLayer(type);
//         if (darkMode) typeImg.classList.add("dark");
//         colorImg.draggable = false;
//         typeImg.draggable = false;

//         cardDiv.appendChild(colorImg);
//         cardDiv.appendChild(typeImg);

//         cardDiv.addEventListener("click", () => {
//             if (cardDiv.classList.contains("disabled")) return;
//             connection.send(new CardPlacedEvent(new Card(type, new CardColor(color), id), ""));
//         });

//         const allowed = topCard.compare(new Card(type, new CardColor(color)));
//         console.log(allowed);

//         if (!allowed) cardDiv.classList.add("disabled");

//         document.querySelector("#deck")!.appendChild(cardDiv);
//     }
// }

// function sortCards(cards: { color: CardColorType; type: CardType; id: string }[]) {
//     const rCards = cards
//         .filter((card) => card.color === "r")
//         .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
//     const gCards = cards
//         .filter((card) => card.color === "g")
//         .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
//     const tCards = cards
//         .filter((card) => card.color === "t")
//         .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
//     const bCards = cards
//         .filter((card) => card.color === "b")
//         .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
//     const lCards = cards
//         .filter((card) => card.color === "p")
//         .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
//     const yCards = cards
//         .filter((card) => card.color === "y")
//         .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
//     const etcCards = cards
//         .filter((card) => card.color === "c")
//         .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0));

//     return rCards
//         .concat(gCards)
//         .concat(tCards)
//         .concat(bCards)
//         .concat(lCards)
//         .concat(yCards)
//         .concat(etcCards);
// }

// connection.registerEvent<CardPlacedEvent>("OnuCardPlacedEvent", (event) => {
//     cards = cards.filter((card) => event.card.id != card.id);

//     topCard = new Card(event.card.type, new CardColor(event.card.color.color));
//     const cardDiv = document.createElement("div");
//     cardDiv.classList.add("card");
//     cardDiv.classList.add("stackCard");

//     const colorImg = createCardLayer(event.card.color.color);
//     const typeImg = createCardLayer(event.card.type);
//     typeImg.classList.add("dark");
//     colorImg.draggable = false;
//     typeImg.draggable = false;

//     const rotation = `${Math.random() * 20 - 10}deg`;
//     colorImg.style.rotate = rotation;
//     typeImg.style.rotate = rotation;

//     cardDiv.appendChild(colorImg);
//     cardDiv.appendChild(typeImg);
//     document.querySelector("#stack")!.appendChild(cardDiv);

//     showCards();
// });

// connection.registerEvent<CardRequestEvent>("OnuCardRequestEvent", (event) => {
//     cards = event.data!;
//     showCards();
// });

// if (darkMode) document.body.classList.add("dark");
