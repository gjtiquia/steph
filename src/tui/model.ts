import type { IModel } from ".";
import type { Keypress } from "./lib/simple-tui";

let title = "steph"
let text = "waiting input..."
let showCursor = false

export function createModel(): IModel {
    return {
        onKeypress,
        getLines,
        isCursorVisible: () => showCursor,
    }
}

function onKeypress(keypress: Keypress) {
    // typically safe for typing
    if (keypress.text) {
        text = "Text: " + keypress.text
        showCursor = true // TODO : needa figure out cursor position during typing
    }

    // for special keys like arrows etc.
    else {
        text = "Key: " + (keypress.key.name ?? keypress.key.sequence)
        showCursor = false
    }

}

function getLines(): string[] {
    return [
        title,
        text,
    ]
}
