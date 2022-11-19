import { JoinedLobbyEvent, JoinLobbyEvent } from "@lebogo/onu2-shared";
import { DevMode } from "../DevMode";
import { BaseGame } from "../main";
import { OnuScreen } from "./OnuScreen";

const joinGameButton = document.getElementById("joinGameButton") as HTMLButtonElement;
const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
const lobbycodeInput = document.getElementById("lobbycodeInput") as HTMLInputElement;

export class Startscreen extends OnuScreen {
    constructor(private baseGame: BaseGame) {
        super("startScreen");
        this.registerEvents();

        // add updateServerlist to the window object so it can be called from the console
        (window as any).updateServerlist = this.updateServerlist;

        this.updateServerlist();
    }

    async updateServerlist(customServerlist?: string) {
        // get serverSelection dropdown
        const serverSelection = document.getElementById("serverSelection") as HTMLSelectElement;
        const serverlist = localStorage.getItem("serverlist") || "public";

        // fetch selected serverlist from github
        // https://raw.githubusercontent.com/OnuGame/onu2-public-data/master/data/development-servers.json
        const response = await fetch(
            customServerlist ||
                `https://raw.githubusercontent.com/OnuGame/onu2-public-data/master/data/${serverlist}-servers.json`
        );
        const servers = await response.json();

        // clear serverSelection dropdown
        serverSelection.innerHTML = "";

        // add servers to serverSelection dropdown
        for (const server of servers) {
            const option = document.createElement("option");
            option.value = server.server;
            option.setAttribute("client", server.client);
            option.setAttribute("version", server.version);
            option.setAttribute("maintainerName", server.maintainer.name);
            option.setAttribute("maintainerContact", server.maintainer.contact);
            option.setAttribute("repository", server.maintainer.repository);

            // if server.client is the same url as the current url, select it as default. ignore trailing slash
            if (server.client.replace(/\/$/, "") === location.origin.replace(/\/$/, "")) {
                option.selected = true;
            }

            option.innerText = server.name + " (" + server.version + ")";
            serverSelection.appendChild(option);

            DevMode.log(
                "🌐",
                `Server: ${server.name} (${server.version}) | Client: ${server.client} | Maintainer: ${server.maintainer.name} (${server.maintainer.contact})`
            );
        }

        serverSelection.addEventListener("change", () => {
            // change location to selected server.client if it is different from the current url. ignore trailing slash
            if (
                serverSelection.selectedOptions[0].getAttribute("client")!.replace(/\/$/, "") !==
                location.origin.replace(/\/$/, "")
            ) {
                location.href = serverSelection.selectedOptions[0].getAttribute("client")!;
            }
        });
    }

    registerEvents() {
        const connection = this.baseGame.connection;

        joinGameButton.addEventListener("click", async () => {
            this.baseGame.username = usernameInput.value;
            this.baseGame.lobbycode = lobbycodeInput.value;

            // get server url from serverSelection dropdown
            const serverSelection = document.getElementById("serverSelection") as HTMLSelectElement;
            const serverUrl = serverSelection.selectedOptions[0].value;

            connection.setServerURL(serverUrl);

            await connection.connect();
            connection.send(new JoinLobbyEvent(this.baseGame.lobbycode, this.baseGame.username));
        });

        connection.registerEvent<JoinedLobbyEvent>("JoinedLobbyEvent", ({ uuid }) => {
            this.baseGame.uuid = uuid;
            this.baseGame.screenManager.setActiveScreen("lobbyScreen");
        });
    }
}
