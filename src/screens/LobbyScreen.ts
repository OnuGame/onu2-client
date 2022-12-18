import {
    GameStartEvent,
    SettingsChangedEvent,
    UpdateAdminEvent,
    UpdatePlayerlistEvent,
} from "@lebogo/onu2-shared";
import { BaseGame } from "../main";
import { Notification } from "../Notification";
import { OnuScreen } from "./OnuScreen";

const lobbyPlayerlist = document.getElementById("lobbyPlayerlist") as HTMLOListElement;
const musicToggle = document.querySelector("#musicToggle") as HTMLImageElement;
const themeToggle = document.querySelector("#themeToggle") as HTMLImageElement;
const discordInvite = document.querySelector("#discordInvite") as HTMLAnchorElement;

export class LobbyScreen extends OnuScreen {
    players: { username: string; uuid: string; cardCount: number }[];
    constructor(private baseGame: BaseGame) {
        super("lobbyScreen");
        this.players = [];
        this.initialize();
    }

    setActive(): void {
        super.setActive();

        if (this.baseGame.music) return;
        this.baseGame.music = document.createElement("audio");
        this.baseGame.music.src = "/assets/sounds/music.mp3";
        this.baseGame.music.addEventListener("ended", () => {
            this.baseGame.music?.play();
        });

        if (localStorage.getItem("music") === "true") {
            this.baseGame.music.play();
        } else {
            musicToggle.src = "/assets/images/music_off.png";
        }
    }

    setTheme(theme: string): void {
        super.setTheme(theme);

        if (theme === "dark") {
            themeToggle.src = "/assets/images/theme_dark.png";
        } else {
            themeToggle.src = "/assets/images/theme_light.png";
        }
    }

    async initialize() {
        const connection = this.baseGame.connection;
        musicToggle.addEventListener("click", () => {
            if (this.baseGame.music?.paused) {
                this.baseGame.music.play();
                musicToggle.src = "/assets/images/music_on.png";
                localStorage.setItem("music", "true");
            } else {
                this.baseGame.music?.pause();
                musicToggle.src = "/assets/images/music_off.png";
                localStorage.setItem("music", "false");
            }
        });

        themeToggle.addEventListener("click", () => {
            if (this.theme == "dark") {
                this.baseGame.screenManager.setTheme("light");
                themeToggle.src = "/assets/images/theme_light.png";
            } else {
                this.baseGame.screenManager.setTheme("dark");
                themeToggle.src = "/assets/images/theme_dark.png";
            }
        });

        discordInvite.addEventListener("click", () => {
            window.open("https://discord.gg/NHgXTXNGfR", "_blank");
        });

        connection.registerEvent<UpdateAdminEvent>("UpdateAdminEvent", ({ uuid }) => {
            this.baseGame.isAdmin = this.baseGame.uuid === uuid;

            if (this.baseGame.isAdmin) {
                document.querySelector("#startGameButton")?.remove();
                const lobbyMenu = document.querySelector("#lobbyMenu")!;

                const startButton = document.createElement("button");
                startButton.id = "startGameButton";
                startButton.classList.add(this.theme);

                startButton.addEventListener("click", () => {
                    connection.send(new GameStartEvent());
                });

                document.querySelectorAll(".settings-element")?.forEach((elm) => {
                    elm.removeAttribute("disabled");
                });

                startButton.innerText = "Start Game!";
                lobbyMenu.appendChild(startButton);
            }
        });

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
            }
        );
        connection.registerEvent<GameStartEvent>("GameStartEvent", () => {
            this.baseGame.screenManager.setActiveScreen("gameScreen");
        });

        connection.registerEvent<SettingsChangedEvent>("SettingsChangedEvent", ({ settings }) => {
            const settingsBox = document.querySelector("#gameSettings")!;
            settingsBox.innerHTML = "";

            for (let key of Object.keys(settings)) {
                const inputGroup = document.createElement("div");
                inputGroup.classList.add("input-group");

                const label = document.createElement("label");
                label.innerText = settings[key].name;
                inputGroup.appendChild(label);

                const select = document.createElement("select");
                select.classList.add("settings-element");
                if (!this.baseGame.isAdmin) select.setAttribute("disabled", "true");

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

            // create a button to copy the lobby code + link to the clipboard
            const copyButton = document.createElement("button");
            copyButton.classList.add("settings-element");
            copyButton.innerText = "Copy Lobby Code";
            copyButton.addEventListener("click", () => {
                navigator.clipboard.writeText(
                    `${window.location.origin}/#${this.baseGame.lobbycode}`
                );
                new Notification("Copied lobby code to clipboard!", 2000).show();
            });

            settingsBox.appendChild(copyButton);
        });
    }
}
