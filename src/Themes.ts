import { OnuTheme } from "./OnuTheme";

const Themes: { [key: string]: OnuTheme } = {
    dark: {
        cards: {
            r: "#E64A33",
            g: "#33cc2f",
            b: "#469DFD",
            y: "#E3A300",
            p: "#E864CE",
            c: "#4AE8B6",
            border: "#fff",
            background: "#111111",
            main: "#ffffff",
            black: "#111111",
            white: "#ffffff",
        },
        ui: {
            button: "#5c1a1a",
            background: "#111111",
            text: "#ffffff",
            input: "#ff000033",
        },
    },
    light: {
        cards: {
            r: "#FF002C",
            g: "#3CE53E",
            b: "#5190FC",
            y: "#f5b000",
            p: "#C356FF",
            c: "#00DEBD",
            border: "#111111",
            background: "#fff",
            main: "#111111",
            black: "#111111",
            white: "#ffffff",
        },
        ui: {
            button: "#ff7f50",
            background: "#805350",
            text: "#ffffff",
            input: "#00000033",
        },
    },
};

export default Themes;
