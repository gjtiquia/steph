import type { KeyDisplayProps } from "../types";
import type { Tree } from "../tree";
import type { Component } from "../component";

export const keyDisplay: Component<KeyDisplayProps> = {
    key: "key-display",
    init: () => ({ lastKey: "waiting input..." }),
    update: (msg, props, _model) => {
        if (msg.type !== "Keypress") return { props, changed: false };

        let lastKey: string;
        if (msg.name === "backspace") lastKey = "Special: Backspace";
        else if (msg.name === "left") lastKey = "Special: Left";
        else if (msg.name === "right") lastKey = "Special: Right";
        else if (msg.text !== undefined && msg.text.length > 0)
            lastKey = "Text: " + msg.text;
        else lastKey = "Key: " + msg.name;

        if (lastKey === props.lastKey) return { props, changed: false };

        return { props: { lastKey }, changed: true };
    },
    view: (props, _model): Tree => ({ type: "text", text: props.lastKey }),
};
