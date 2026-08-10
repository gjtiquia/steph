import type { Model, Msg } from "../shared";
import * as tea from "./lib/lemontea";
import { applyKeypress } from "./edit";

export function fromTuiKeys(
    keypress: tea.ReadlineKeypress,
    model: Model,
): Msg[] {
    const name = `${keypress.key.name ?? keypress.key.sequence}`;
    const msgs: Msg[] = [{ type: "Keypress", name, text: keypress.text }];

    const isEditing =
        (keypress.text !== undefined && keypress.text.length > 0) ||
        name === "backspace" ||
        name === "left" ||
        name === "right";

    if (isEditing) {
        const edit = applyKeypress(
            { name, text: keypress.text },
            model.input.value,
            model.input.cursor,
        );
        if (edit) {
            msgs.push({
                type: "ValueChanged",
                value: edit.value,
                cursor: edit.cursor,
            });
        }
    }

    return msgs;
}
