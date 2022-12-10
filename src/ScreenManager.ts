import { OnuScreen } from "./screens/OnuScreen";

export class ScreenManager {
    activeScreen: OnuScreen;
    theme: string;

    constructor(private screens: OnuScreen[]) {
        this.activeScreen = screens[0];
        this.activeScreen.setActive();

        this.theme = localStorage.getItem("theme") || "light";
        this.setTheme(this.theme);
    }

    setActiveScreen(name: string) {
        const newActiveScreen = this.screens.find((screen) => screen.name == name);
        if (!newActiveScreen) return;
        // Set old screen inactive
        this.activeScreen.setInactive();

        // Set new screen active
        this.activeScreen = newActiveScreen;
        this.activeScreen.setActive();
    }

    setTheme(theme: string) {
        this.theme = theme;
        this.screens.forEach((screen) => {
            screen.setTheme(this.theme);
        });

        localStorage.setItem("theme", this.theme);
    }

    setNextScreen() {
        const currentScreenId = this.screens.indexOf(this.activeScreen);
        const nextScreenId = currentScreenId + 1 == this.screens.length ? 0 : currentScreenId + 1;
        this.activeScreen.setInactive();
        this.activeScreen = this.screens[nextScreenId];
        this.activeScreen.setActive();
    }
}
