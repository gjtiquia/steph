import type { Model } from "./types";

export const modelFieldFor: Record<string, keyof Model> = {
    "static-text": "staticText",
    input: "input",
    "key-display": "keyDisplay",
    "count-getter": "count",
    "count-setter": "count",
    list: "list",
};

export const fieldKeysFor: Partial<Record<keyof Model, string[]>> = {
    staticText: ["static-text"],
    input: ["input"],
    keyDisplay: ["key-display"],
    count: ["count-getter", "count-setter"],
    list: ["list"],
};
