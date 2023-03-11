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
