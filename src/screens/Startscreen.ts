import { JoinedLobbyEvent, JoinLobbyEvent } from "@lebogo/onu2-shared";
import { BaseGame } from "../main";
import { OnuScreen } from "./OnuScreen";

const joinGameButton = document.getElementById("joinGameButton") as HTMLButtonElement;
const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
const lobbycodeInput = document.getElementById("lobbycodeInput") as HTMLInputElement;

export class Startscreen extends OnuScreen {
    constructor(private baseGame: BaseGame) {
        super("startScreen");
        this.registerEvents();
    }

    registerEvents() {
        const connection = this.baseGame.connection;

        joinGameButton.addEventListener("click", () => {
            this.baseGame.username = usernameInput.value;
            this.baseGame.lobbycode = lobbycodeInput.value;
            connection.send(new JoinLobbyEvent(this.baseGame.lobbycode, this.baseGame.username));
        });

        connection.registerEvent<JoinedLobbyEvent>("JoinedLobbyEvent", ({ uuid, hash }) => {
            this.baseGame.uuid = uuid;
            this.baseGame.hash = hash;
            this.baseGame.screenManager.setActiveScreen("lobbyScreen");
        });
    }
}
