import type { StaticTextSlice } from "../types";
import type { Tree } from "../tree";
import type { Widget } from "../widget";

export const staticText: Widget<StaticTextSlice> = {
    key: "static-text",
    init: () => ({}),
    update: (_msg, slice, _model) => ({ slice, changed: false }),
    view: (_slice, _model): Tree => ({
        type: "section",
        children: [
            { type: "text", text: "" },
            { type: "text", text: "steph" },
            { type: "text", text: "" },
        ],
    }),
};
