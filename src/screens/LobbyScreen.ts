import { GameStartEvent, SettingsChangedEvent, UpdatePlayerlistEvent } from "@lebogo/onu2-shared";
import { BaseGame } from "../main";
import { OnuScreen } from "./OnuScreen";

const lobbyPlayerlist = document.getElementById("lobbyPlayerlist") as HTMLOListElement;

export class LobbyScreen extends OnuScreen {
    players: { username: string; hash: string; cardCount: number }[];
    constructor(private baseGame: BaseGame) {
        super("lobbyScreen");
        this.players = [];
        this.registerEvents();
    }

    registerEvents() {
        const connection = this.baseGame.connection;

        connection.registerEvent<UpdatePlayerlistEvent>(
            "UpdatePlayerlistEvent",
            ({ playerlist }) => {
                this.players = playerlist;

                lobbyPlayerlist.innerHTML = "";
                playerlist.forEach(({ username }) => {
                    const playerListPlayer = document.createElement("li");
                    playerListPlayer.classList.add("playerlistItem");
                    playerListPlayer.innerText = username;

                    lobbyPlayerlist.appendChild(playerListPlayer);
                });

                if (this.baseGame.hash == this.players[0].hash) {
                    document.querySelector("#startGameButton")?.remove();

                    // this player is admin (index 0)
                    const lobbyMenu = document.querySelector("#lobbyMenu")!;

                    const startButton = document.createElement("button");
                    startButton.id = "startGameButton";
                    startButton.classList.add(
                        this.baseGame.screenManager.darkmode ? "dark" : "light"
                    );

                    startButton.addEventListener("click", () => {
                        connection.send(new GameStartEvent());
                    });

                    startButton.innerText = "Start Game!";
                    lobbyMenu.appendChild(startButton);
                }
            }
        );
        connection.registerEvent<GameStartEvent>("GameStartEvent", () => {
            this.baseGame.screenManager.setActiveScreen("gameScreen");
        });

        connection.registerEvent<SettingsChangedEvent>("SettingsChangedEvent", ({ settings }) => {
            console.log(settings);
            const settingsBox = document.querySelector("#gameSettings")!;
            settingsBox.innerHTML = "";

            for (let key of Object.keys(settings)) {
                const inputGroup = document.createElement("div");
                inputGroup.classList.add("input-group");

                const label = document.createElement("label");
                label.innerText = settings[key].name;
                inputGroup.appendChild(label);

                const select = document.createElement("select");
                select.classList.add(this.baseGame.screenManager.darkmode ? "dark" : "light");

                for (let option of settings[key].defaults) {
                    const selectOption = document.createElement("option");
                    if (option == settings[key].value) selectOption.selected = true;
                    selectOption.value = option;
                    selectOption.text = option;
                    select.appendChild(selectOption);
                }

                select.addEventListener("change", () => {
                    settings[key].value = select.value;
                    connection.send(new SettingsChangedEvent(settings));
                });
                inputGroup.appendChild(select);

                settingsBox.appendChild(inputGroup);
            }

            // settingsBox?.appendChild
            /*
         <div class="input-group">
            // <label for="cardCountSelect">Card count:</label>
            <select id="cardCountSelect">
                <option value="5">5</option>
                <option value="7">7</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
            </select>
        </div>
        <button id="startGameButton">Start Game!</button>;
    */
        });
    }
}
