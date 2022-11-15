import { BaseGame } from "./main";
import { Startscreen } from "./screens/Startscreen";

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

        document.querySelector("#themeToggle")!.addEventListener("click", () => {
            BaseGame.instance.screenManager.setDarkmode(!BaseGame.instance.screenManager.darkmode);
        });

        const serverSelection = document.querySelector(
            "#serverlistSelection"
        )! as HTMLSelectElement;
        // set current serverlist as default value
        serverSelection.value = localStorage.getItem("serverlist") || "default";

        serverSelection.addEventListener("change", (e) => {
            const target = e.target as HTMLSelectElement;
            const serverlist = target.value;
            localStorage.setItem("serverlist", serverlist);
            // check if BaseGame.instance.screenManager.activeScreen is Startscreen
            // if yes, reload serverlist in startscreen
            // if no, do nothing
            if (BaseGame.instance.screenManager.activeScreen.name == "startScreen") {
                (BaseGame.instance.screenManager.activeScreen as Startscreen).updateServerlist();
            }
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

    static log(message: string) {
        const li = document.createElement("li");
        li.innerHTML = message;
        // insert new log at the top
        DevMode.instance.debugLog.insertBefore(li, DevMode.instance.debugLog.firstChild);
        // DevMode.instance.debugLog.appendChild(li);
        // remove old logs
        if (DevMode.instance.debugLog.childElementCount > 200) {
            DevMode.instance.debugLog.removeChild(DevMode.instance.debugLog.lastChild!);
        }
    }
}
