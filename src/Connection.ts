import { BaseEvent, EventSystem } from "@lebogo/eventsystem";

export class Connection extends EventSystem {
    ws!: WebSocket;
    id: string | undefined;
    listeners: Map<string, Function[]> = new Map();

    constructor(private address: string, public autoreconnect: boolean = true) {
        super();
        this.connect();
    }

    private connect() {
        this.ws = new WebSocket(this.address);

        this.ws.onclose = this.connectionClosed.bind(this);

        this.ws.onopen = this.connectionOpened.bind(this);
        this.ws.onmessage = this.messageReceived.bind(this);
    }

    public send(event: BaseEvent) {
        if (this.ws.readyState != this.ws.OPEN) throw new Error("Websocket is not open.");
        this.ws.send(JSON.stringify(event));
    }

    private messageReceived(ev: { data: string }) {
        this.parse(ev.data);
    }

    private connectionOpened() {
        if (this.id) return;
        console.log("Connected to server!");
    }

    private connectionClosed() {
        if (this.autoreconnect) {
            setTimeout(() => {
                console.log("Connection failed. Trying to reconnect...");
                this.connect();
            }, 1000);
        }
    }
}
