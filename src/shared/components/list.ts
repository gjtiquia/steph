import type { ListProps } from "../types";
import type { Tree } from "../tree";
import type { Component } from "../component";

const TITLE = "this is a list with options";
const OPTIONS = ["option 1", "option 2", "option 3"];

export const list: Component<ListProps> = {
    key: "list",
    init: () => ({ selectedIndex: 0 }),
    update: (msg, props, _model) => {
        if (msg.type === "Select") {
            const selectedIndex = Math.max(0, Math.min(OPTIONS.length - 1, msg.index));
            if (selectedIndex === props.selectedIndex)
                return { props, changed: false };
            return { props: { selectedIndex }, changed: true };
        }

        if (msg.type !== "Keypress") return { props, changed: false };

        const isUp = msg.name === "up" || msg.text === "k";
        const isDown = msg.name === "down" || msg.text === "j";

        if (isUp) {
            const selectedIndex = Math.max(0, props.selectedIndex - 1);
            if (selectedIndex === props.selectedIndex) return { props, changed: false };
            return { props: { selectedIndex }, changed: true };
        }

        if (isDown) {
            const selectedIndex = Math.min(
                OPTIONS.length - 1,
                props.selectedIndex + 1,
            );
            if (selectedIndex === props.selectedIndex) return { props, changed: false };
            return { props: { selectedIndex }, changed: true };
        }

        return { props, changed: false };
    },
    view: (props, _model): Tree => ({
        type: "list",
        title: TITLE,
        options: OPTIONS,
        selectedIndex: props.selectedIndex,
    }),
};
