import type { ListSlice } from "../types";
import type { Tree } from "../tree";
import type { Widget } from "../widget";

const TITLE = "this is a list with options";
const OPTIONS = ["option 1", "option 2", "option 3"];

export const list: Widget<ListSlice> = {
    key: "list",
    init: () => ({ selectedIndex: 0 }),
    update: (msg, slice, _model) => {
        if (msg.type === "Select") {
            const selectedIndex = Math.max(0, Math.min(OPTIONS.length - 1, msg.index));
            if (selectedIndex === slice.selectedIndex)
                return { slice, changed: false };
            return { slice: { selectedIndex }, changed: true };
        }

        if (msg.type !== "Keypress") return { slice, changed: false };

        const isUp = msg.name === "up" || msg.text === "k";
        const isDown = msg.name === "down" || msg.text === "j";

        if (isUp) {
            const selectedIndex = Math.max(0, slice.selectedIndex - 1);
            if (selectedIndex === slice.selectedIndex) return { slice, changed: false };
            return { slice: { selectedIndex }, changed: true };
        }

        if (isDown) {
            const selectedIndex = Math.min(
                OPTIONS.length - 1,
                slice.selectedIndex + 1,
            );
            if (selectedIndex === slice.selectedIndex) return { slice, changed: false };
            return { slice: { selectedIndex }, changed: true };
        }

        return { slice, changed: false };
    },
    view: (slice, _model): Tree => ({
        type: "list",
        title: TITLE,
        options: OPTIONS,
        selectedIndex: slice.selectedIndex,
    }),
};
