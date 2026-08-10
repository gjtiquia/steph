import type { InputProps } from "../types";
import type { Tree } from "../tree";
import type { Component } from "../component";

export const input: Component<InputProps> = {
    key: "input",
    init: () => ({ value: "", cursor: 0, showCursor: false }),
    update: (msg, props, _model) => {
        if (msg.type === "Keypress") {
            const isEditing =
                (msg.text !== undefined && msg.text.length > 0) ||
                msg.name === "backspace" ||
                msg.name === "left" ||
                msg.name === "right";
            const showCursor = isEditing;

            if (showCursor === props.showCursor) return { props, changed: false };

            return { props: { ...props, showCursor }, changed: true };
        }

        if (msg.type === "ValueChanged") {
            return {
                props: { value: msg.value, cursor: msg.cursor, showCursor: true },
                changed: true,
            };
        }

        return { props, changed: false };
    },
    view: (props, _model): Tree => ({
        type: "input",
        prefix: "Type: ",
        value: props.value,
        cursor: props.cursor,
        showCursor: props.showCursor,
    }),
};
