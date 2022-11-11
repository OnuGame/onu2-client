export class OnuScreen {
    private screen: HTMLDivElement;
    public theme = "light";
    constructor(public name: string) {
        this.screen = document.getElementById(this.name) as HTMLDivElement;
    }

    setActive() {
        this.screen.classList.add("active");
    }

    setInactive() {
        this.screen.classList.remove("active");
    }

    setDarkmode(on: boolean) {
        if (on) {
            document.querySelectorAll(".light").forEach((element) => {
                element.classList.add("dark");
                element.classList.remove("light");
            });
            this.theme = "dark";
        } else {
            document.querySelectorAll(".dark").forEach((element) => {
                element.classList.add("light");
                element.classList.remove("dark");
            });
            this.theme = "light";
        }
    }
}
