import type { KeyDisplaySlice } from "../types";
import type { Tree } from "../tree";
import type { Widget } from "../widget";

export const keyDisplay: Widget<KeyDisplaySlice> = {
    key: "key-display",
    init: () => ({ lastKey: "waiting input..." }),
    update: (msg, slice, _model) => {
        if (msg.type !== "Keypress") return { slice, changed: false };

        let lastKey: string;
        if (msg.name === "backspace") lastKey = "Special: Backspace";
        else if (msg.name === "left") lastKey = "Special: Left";
        else if (msg.name === "right") lastKey = "Special: Right";
        else if (msg.text !== undefined && msg.text.length > 0)
            lastKey = "Text: " + msg.text;
        else lastKey = "Key: " + msg.name;

        if (lastKey === slice.lastKey) return { slice, changed: false };

        return { slice: { lastKey }, changed: true };
    },
    view: (slice, _model): Tree => ({ type: "text", text: slice.lastKey }),
};
