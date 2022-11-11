import { OnuScreen } from "./screens/OnuScreen";

export class ScreenManager {
    activeScreen: OnuScreen;
    darkmode: boolean;

    constructor(private screens: OnuScreen[]) {
        this.activeScreen = screens[0];
        this.activeScreen.setActive();
        this.darkmode = localStorage.getItem("darkmode") == "true";
        this.setDarkmode(this.darkmode);
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

    setDarkmode(on: boolean) {
        this.screens.forEach((screen) => {
            screen.setDarkmode(on);
        });
    }

    setNextScreen() {
        const currentScreenId = this.screens.indexOf(this.activeScreen);
        const nextScreenId = currentScreenId + 1 == this.screens.length ? 0 : currentScreenId + 1;
        this.activeScreen.setInactive();
        this.activeScreen = this.screens[nextScreenId];
        this.activeScreen.setActive();
    }
}
