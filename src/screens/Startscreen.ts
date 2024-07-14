import { JoinedLobbyEvent, JoinLobbyEvent, SpectateLobbyEvent } from "@lebogo/onu2-shared";
import { Connection } from "../Connection";
import { BaseGame } from "../main";
import { Notification } from "../Notification";
import { OnuScreen } from "./OnuScreen";

const joinGameButton = document.getElementById("joinGameButton") as HTMLButtonElement;
const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
const lobbycodeInput = document.getElementById("lobbycodeInput") as HTMLInputElement;

export class Startscreen extends OnuScreen {
    constructor(private baseGame: BaseGame) {
        super("startScreen");
        this.initialize();
    }

    async initialize() {
        const connection = this.baseGame.connection;

        const spectate = localStorage.getItem("spectate");
        if (spectate != null) {
            await this.connectToServer(connection);

            this.baseGame.connection.send(new SpectateLobbyEvent(spectate));
            this.baseGame.screenManager.setActiveScreen("lobbyScreen");

            return;
        }

        usernameInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                joinGameButton.click();
            }
        });

        lobbycodeInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                joinGameButton.click();
            }
        });

        if (location.hash) {
            const lobbyCode = location.hash.replace("#", "");
            lobbycodeInput.value = decodeURI(lobbyCode);
            history.replaceState(
                "",
                document.title,
                window.location.pathname + window.location.search
            );
        }

        joinGameButton.addEventListener("click", async () => {
            this.baseGame.username = usernameInput.value;
            this.baseGame.lobbycode = lobbycodeInput.value;

            if (this.baseGame.username.trim() == "") {
                usernameInput.classList.add("invalid");
                new Notification("Please enter a username", 2000).show();
                setTimeout(() => {
                    usernameInput.classList.remove("invalid");
                }, 250);
                return;
            }

            if (this.baseGame.lobbycode.trim() == "") {
                lobbycodeInput.classList.add("invalid");
                new Notification("Please enter a lobby code", 2000).show();
                setTimeout(() => {
                    lobbycodeInput.classList.remove("invalid");
                }, 250);
                return;
            }

            await this.connectToServer(connection);

            connection.send(new JoinLobbyEvent(this.baseGame.lobbycode, this.baseGame.username));
        });

        connection.registerEvent<JoinedLobbyEvent>("JoinedLobbyEvent", ({ uuid }) => {
            this.baseGame.uuid = uuid;
            this.baseGame.screenManager.setActiveScreen("lobbyScreen");
        });
    }

    async connectToServer(connection: Connection) {
        let server = "";
        if (import.meta.env.MODE == "production") {
            server = location.href.replace("http", "ws");
        } else {
            server = `ws://localhost:3000`;
            if (!(await connection.test(server))) server = "wss://onu.lebogo.me"; // Fallback server if local dev server is offline
        }

        connection.setServerURL(server);

        await connection.connect();
    }
}
