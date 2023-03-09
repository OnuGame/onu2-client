export class SoundManager {
    constructor() {
        this.music.player.src = "/assets/sounds/music.mp3";
        this.music.player.addEventListener("ended", () => {
            this.music.play();
        });

        this.music.enabled = localStorage.getItem("music") == "true";
        this.sounds.enabled = localStorage.getItem("sounds") == "true";

        console.log(this.music.enabled);
        console.log(this.sounds.enabled);
    }

    music = {
        player: document.createElement("audio"),
        enabled: false,

        play() {
            this.player.volume = 1;
            this.player.play();
        },

        pause() {
            let i = setInterval(() => {
                this.player.volume = Math.max(0, this.player.volume - 0.02);
                if (this.player.volume == 0) {
                    clearInterval(i);
                    this.player.pause();
                }
            }, 1);
        },

        toggle() {
            this.enabled = !this.enabled;
            if (this.enabled) this.play();
            else this.pause();

            localStorage.setItem("music", this.enabled.toString());
            return this.enabled;
        },
    };

    sounds = {
        enabled: false,

        play(soundName: string) {
            if (!this.enabled) return;

            let soundElement = document.createElement("audio");
            soundElement.src = `/assets/sounds/${soundName}.wav`;
            soundElement.play();
            soundElement.addEventListener("ended", () => {
                soundElement.remove();
            });
        },

        toggle() {
            this.enabled = !this.enabled;

            localStorage.setItem("sounds", this.enabled.toString());
            return this.enabled;
        },
    };
}
