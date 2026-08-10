import type { Model } from "./types";

export function init(): Model {
    return {
        staticText: {},
        input: { value: "", cursor: 0, showCursor: false },
        keyDisplay: { lastKey: "waiting input..." },
        list: { selectedIndex: 0 },
        count: { count: 0 },
    };
}
