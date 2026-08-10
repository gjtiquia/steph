import type { CountSlice } from "../types";
import type { Tree } from "../tree";
import type { Widget } from "../widget";

export const countGetter: Widget<CountSlice> = {
    key: "count-getter",
    init: () => ({ count: 0 }),
    update: (_msg, slice, _model) => ({ slice, changed: false }),
    view: (slice, _model): Tree => ({
        type: "text",
        text: "count: " + slice.count + " (this is using shared state)",
    }),
};

export const countSetter: Widget<CountSlice> = {
    key: "count-setter",
    init: () => ({ count: 0 }),
    update: (msg, slice, _model) => {
        if (msg.type !== "Keypress") return { slice, changed: false };
        return { slice: { count: slice.count + 1 }, changed: true };
    },
    view: (slice, _model): Tree => ({
        type: "text",
        text: "count: " + slice.count + " (press any key to increment)",
    }),
};
