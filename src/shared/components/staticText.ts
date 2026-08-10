import type { StaticTextProps } from "../types";
import type { Tree } from "../tree";
import type { Component } from "../component";

export const staticText: Component<StaticTextProps> = {
    key: "static-text",
    init: () => ({}),
    update: (_msg, props, _model) => ({ props, changed: false }),
    view: (_props, _model): Tree => ({
        type: "section",
        children: [
            { type: "text", text: "" },
            { type: "text", text: "steph" },
            { type: "text", text: "" },
        ],
    }),
};
