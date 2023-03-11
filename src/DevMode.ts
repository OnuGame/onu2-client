import { BaseGame } from "./main";
import { Notification } from "./Notification";

export class DevMode {
    public static instance: DevMode;
    private static devLog: string[] = [];
    active: boolean = false;
    devModeToggle: HTMLDivElement = document.querySelector("#devToggle")!;
    devModeContainer: HTMLDivElement = document.querySelector("#debugOutput")!;
    debugLog: HTMLUListElement = document.querySelector("#debugLog")!;

    constructor() {
        DevMode.instance = this;
        this.devModeToggle.addEventListener("dblclick", () => {
            this.toggle();
        });

        document.querySelector("#downloadLog")!.addEventListener("click", () => {
            const log = DevMode.devLog.join("\n");

            var element = document.createElement("a");
            element.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," + encodeURIComponent(log)
            );
            const now = new Date();
            element.setAttribute(
                "download",
                `onu-log-${now.toLocaleDateString()}-${now.toLocaleTimeString()}.log`
            );

            element.style.display = "none";
            element.click();
        });

        document.querySelector("#reportLog")!.addEventListener("click", async () => {
            const log = DevMode.devLog.join("\n");

            const backendUrl = BaseGame.instance.connection.getServerURL().replace("ws", "http");

            const reportUrl = (backendUrl + "/report").replace("//report", "/report");

            const request = await fetch(reportUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: log,
            });

            if (request.status == 200) new Notification("Log successfully reported!", 5000).show();
            else new Notification(`Something went wrong: ${await request.text()}`, 5000).show();
        });
    }

    public static toggle() {
        DevMode.instance.toggle();
    }

    toggle() {
        this.active = !this.active;
        if (this.active) {
            this.devModeToggle.classList.add("active");
            this.devModeContainer.style.display = "initial";
        } else {
            this.devModeToggle.classList.remove("active");
            this.devModeContainer.style.display = "none";
        }
    }

    static log(emoji: string, message: string) {
        const logEntry = `${new Date().toLocaleTimeString()} ${emoji} ${message}`;
        this.devLog.push(logEntry);
        const li = document.createElement("li");
        li.innerHTML = logEntry;

        // insert new log at the top
        DevMode.instance.debugLog.insertBefore(li, DevMode.instance.debugLog.firstChild);
        // DevMode.instance.debugLog.appendChild(li);
        // remove old logs
        if (DevMode.instance.debugLog.childElementCount > 200) {
            DevMode.instance.debugLog.removeChild(DevMode.instance.debugLog.lastChild!);
        }
    }
}
