export type Color = `#${string}`;

export type OnuCardColor =
    | "r"
    | "g"
    | "b"
    | "y"
    | "p"
    | "c"
    | "black"
    | "white"
    | "border"
    | "background"
    | "main";

export type OnuUiColor = "button" | "background" | "text" | "input";

export enum CardThemeName {
    Dark = "dark",
    Light = "light",
}

export type OnuTheme = {
    cards: {
        [key in OnuCardColor]: Color;
    };
    ui: {
        [key in OnuUiColor]: Color;
    };
};
