import type { Model, Msg } from "./types";
import type { Component } from "./component";
import { homeScreen } from "./components";
import { modelFieldFor, fieldKeysFor } from "./fields";

export function composeUpdate(
    msg: Msg,
    model: Model,
    components: Component<unknown>[],
): { model: Model; changed: Set<string> } {
    let next: Model = model;
    const changed = new Set<string>();

    for (const component of components) {
        const field = modelFieldFor[component.key];
        if (!field) continue;

        const result = component.update(msg, next[field], next);
        if (!result.changed) continue;

        for (const key of fieldKeysFor[field] ?? []) {
            changed.add(key);
        }
        next = { ...next, [field]: result.props } as Model;
    }

    return { model: next, changed };
}

export function update(
    msg: Msg,
    model: Model,
): { model: Model; changed: Set<string> } {
    return composeUpdate(msg, model, homeScreen);
}
