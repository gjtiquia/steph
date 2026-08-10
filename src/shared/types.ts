export type Msg =
    | { type: "Keypress"; name: string; text: string | undefined }
    | { type: "ValueChanged"; value: string; cursor: number }
    | { type: "Select"; index: number }
    | { type: "Move"; dir: "up" | "down" | "left" | "right" };

export type InputSlice = { value: string; cursor: number; showCursor: boolean };

export type KeyDisplaySlice = { lastKey: string };

export type ListSlice = { selectedIndex: number };

export type CountSlice = { count: number };

export type StaticTextSlice = Record<string, never>;

export type Model = {
    staticText: StaticTextSlice;
    input: InputSlice;
    keyDisplay: KeyDisplaySlice;
    list: ListSlice;
    count: CountSlice;
};

export type WidgetSlice =
    | StaticTextSlice
    | InputSlice
    | KeyDisplaySlice
    | ListSlice
    | CountSlice;
