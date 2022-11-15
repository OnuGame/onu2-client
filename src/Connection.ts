import { BaseEvent, EventSystem } from "@lebogo/eventsystem";
import { PingEvent } from "@lebogo/onu2-shared";
import { DevMode } from "./DevMode";

export class Connection extends EventSystem {
    ws!: WebSocket;
    id: string | undefined;
    listeners: Map<string, Function[]> = new Map();

    constructor(private address: string, public autoreconnect: boolean = true) {
        super();

        this.registerEvent("PingEvent", (event: PingEvent) => {
            this.send(new PingEvent(event.ping));
        });
    }

    public connect() {
        DevMode.log(`⌛ Connecting to ${this.address}...`);
        return new Promise<void>((resolve, reject) => {
            this.ws = new WebSocket(this.address);

            this.ws.addEventListener("close", this.connectionClosed.bind(this));
            this.ws.addEventListener("open", this.connectionOpened.bind(this));
            this.ws.addEventListener("message", this.messageReceived.bind(this));

            // resolve when connection is opened, reject when connection is closed.
            // remove event listeners when one of them is called
            const connectionOpened = () => {
                this.ws.removeEventListener("open", connectionOpened);
                this.ws.removeEventListener("close", connectionClosed);
                resolve();
            };

            const connectionClosed = () => {
                this.ws.removeEventListener("open", connectionOpened);
                this.ws.removeEventListener("close", connectionClosed);
                reject();
            };

            this.ws.addEventListener("open", connectionOpened);
            this.ws.addEventListener("close", connectionClosed);
        });
    }

    public setServerURL(url: string) {
        this.address = url;
    }

    public send(event: BaseEvent) {
        if (this.ws.readyState != this.ws.OPEN) throw new Error("Websocket is not open.");
        DevMode.log("↗️" + event.stringify());
        this.ws.send(event.stringify());
    }

    private messageReceived(ev: { data: string }) {
        DevMode.log("↙️" + ev.data);
        this.parse(ev.data);
    }

    private connectionOpened() {
        if (this.id) return;
        DevMode.log("✔️ Connected to server!");
    }

    private connectionClosed() {
        if (this.autoreconnect) {
            setTimeout(() => {
                DevMode.log("Connection failed. Trying to reconnect...");
                this.connect();
            }, 1000);
        }
    }
}
