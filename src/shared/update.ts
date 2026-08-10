import type { Model, Msg } from "./types";
import type { Widget } from "./widget";
import { homeScreen } from "./widgets";
import { modelFieldFor, fieldKeysFor } from "./fields";

export function composeUpdate(
    msg: Msg,
    model: Model,
    widgets: Widget<unknown>[],
): { model: Model; changed: Set<string> } {
    let next: Model = model;
    const changed = new Set<string>();

    for (const widget of widgets) {
        const field = modelFieldFor[widget.key];
        if (!field) continue;

        const result = widget.update(msg, next[field], next);
        if (!result.changed) continue;

        for (const key of fieldKeysFor[field] ?? []) {
            changed.add(key);
        }
        next = { ...next, [field]: result.slice } as Model;
    }

    return { model: next, changed };
}

export function update(
    msg: Msg,
    model: Model,
): { model: Model; changed: Set<string> } {
    return composeUpdate(msg, model, homeScreen);
}
