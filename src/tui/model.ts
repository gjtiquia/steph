import type { IModel } from ".";
import type { Keypress } from "./lib/simple-tui";

// TODO : probably... gonna do recursive models all the way down, with basic split of [history, title, dashboard, url, ui, footer] ?

// imperative programming with React-style syntax
export function createModel(): IModel {
    let title = "steph"
    let text = "waiting input..."
    let showCursor = false

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

    return {
        onKeypress,
        getLines,
        isCursorVisible: () => showCursor,
    }
}

