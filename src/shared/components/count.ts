import type { CountProps } from "../types";
import type { Tree } from "../tree";
import type { Component } from "../component";

export const countGetter: Component<CountProps> = {
    key: "count-getter",
    init: () => ({ count: 0 }),
    update: (_msg, props, _model) => ({ props, changed: false }),
    view: (props, _model): Tree => ({
        type: "text",
        text: "count: " + props.count + " (this is using shared state)",
    }),
};

export const countSetter: Component<CountProps> = {
    key: "count-setter",
    init: () => ({ count: 0 }),
    update: (msg, props, _model) => {
        if (msg.type !== "Keypress") return { props, changed: false };
        return { props: { count: props.count + 1 }, changed: true };
    },
    view: (props, _model): Tree => ({
        type: "text",
        text: "count: " + props.count + " (press any key to increment)",
    }),
};
