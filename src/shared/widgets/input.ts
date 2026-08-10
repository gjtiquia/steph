import type { InputSlice } from "../types";
import type { Tree } from "../tree";
import type { Widget } from "../widget";

export const input: Widget<InputSlice> = {
    key: "input",
    init: () => ({ value: "", cursor: 0, showCursor: false }),
    update: (msg, slice, _model) => {
        if (msg.type === "Keypress") {
            const isEditing =
                (msg.text !== undefined && msg.text.length > 0) ||
                msg.name === "backspace" ||
                msg.name === "left" ||
                msg.name === "right";
            const showCursor = isEditing;

            if (showCursor === slice.showCursor) return { slice, changed: false };

            return { slice: { ...slice, showCursor }, changed: true };
        }

        if (msg.type === "ValueChanged") {
            return {
                slice: { value: msg.value, cursor: msg.cursor, showCursor: true },
                changed: true,
            };
        }

        return { slice, changed: false };
    },
    view: (slice, _model): Tree => ({
        type: "input",
        prefix: "Type: ",
        value: slice.value,
        cursor: slice.cursor,
        showCursor: slice.showCursor,
    }),
};
