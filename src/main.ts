import { Card, ReconnectedEvent, ReconnectEvent } from "@lebogo/onu2-shared";

import * as config from "../package.json";

import { Connection } from "./Connection";
import { ScreenManager } from "./ScreenManager";
import { GameScreen } from "./screens/GameScreen";
import { LobbyScreen } from "./screens/LobbyScreen";
import { Startscreen } from "./screens/Startscreen";

import "./css/button.css";
import "./css/card.css";
import "./css/clientsettings.css";
import "./css/colorselect.css";
import "./css/deck.css";
import "./css/global.css";
import "./css/playerlist.css";
import "./css/screen.css";
import "./css/select.css";
import "./css/stack.css";
import { DevMode } from "./DevMode";

const PORT = 3000;

export class BaseGame {
    public static instance: BaseGame;
    screenManager: ScreenManager;
    connection: Connection;
    uuid: string | undefined;
    drawAmount: number = 1;
    topCard?: Card;
    deck: Card[] = [];
    username: string | undefined;
    lobbycode: string | undefined;
    isTurn: boolean = false;
    isAdmin: boolean = false;
    music?: HTMLAudioElement;

    constructor() {
        BaseGame.instance = this;
        this.connection = new Connection(`ws://${location.hostname}:${PORT}`);
        this.connection.registerEvent<ReconnectedEvent>("ReconnectedEvent", () => {
            if (this.lobbycode && this.uuid) {
                this.connection.send(new ReconnectEvent(this.lobbycode, this.uuid));
            }
        });

        this.screenManager = new ScreenManager([
            new Startscreen(this),
            new LobbyScreen(this),
            new GameScreen(this),
        ]);

        this.deck = [];
    }
}

new DevMode();
new BaseGame();
document.querySelector("#versionNumber")!.innerHTML = `V${config.version} by ${config.author}`;
