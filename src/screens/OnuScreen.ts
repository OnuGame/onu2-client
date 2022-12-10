import Themes from "../Themes";

export class OnuScreen {
    private screen: HTMLDivElement;
    public theme: string = "light";

    constructor(public name: string) {
        this.screen = document.getElementById(this.name) as HTMLDivElement;
    }

    setActive() {
        this.screen.classList.add("active");
    }

    setInactive() {
        this.screen.classList.remove("active");
    }

    setTheme(theme: string) {
        this.theme = theme;

        let themeColors = Themes[theme];

        // general themes
        document.body.style.backgroundColor = themeColors.ui.background;
        document.getElementById("versionNumber")!.style.color = themeColors.ui.text;

        // set css variables of :root
        document.documentElement.style.setProperty("--primary-color", themeColors.ui.button);
        document.documentElement.style.setProperty("--input-color", themeColors.ui.input);
    }
}
