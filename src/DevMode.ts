export class DevMode {
    public static instance: DevMode;
    active: boolean = false;
    devModeToggle: HTMLDivElement = document.querySelector("#devToggle")!;
    devModeContainer: HTMLDivElement = document.querySelector("#debugOutput")!;
    debugLog: HTMLUListElement = document.querySelector("#debugLog")!;

    constructor() {
        DevMode.instance = this;
        this.devModeToggle.addEventListener("dblclick", () => {
            this.toggle();
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
        const li = document.createElement("li");
        li.innerHTML = `${emoji} ${message}`;
        // insert new log at the top
        DevMode.instance.debugLog.insertBefore(li, DevMode.instance.debugLog.firstChild);
        // DevMode.instance.debugLog.appendChild(li);
        // remove old logs
        if (DevMode.instance.debugLog.childElementCount > 200) {
            DevMode.instance.debugLog.removeChild(DevMode.instance.debugLog.lastChild!);
        }
    }
}
