export type Msg =
    | { type: "Keypress"; name: string; text: string | undefined }
    | { type: "ValueChanged"; value: string; cursor: number }
    | { type: "Select"; index: number }
    | { type: "Move"; dir: "up" | "down" | "left" | "right" };

export type InputProps = { value: string; cursor: number; showCursor: boolean };

export type KeyDisplayProps = { lastKey: string };

export type ListProps = { selectedIndex: number };

export type CountProps = { count: number };

export type StaticTextProps = Record<string, never>;

export type Model = {
    staticText: StaticTextProps;
    input: InputProps;
    keyDisplay: KeyDisplayProps;
    list: ListProps;
    count: CountProps;
};

export type ComponentProps =
    | StaticTextProps
    | InputProps
    | KeyDisplayProps
    | ListProps
    | CountProps;
