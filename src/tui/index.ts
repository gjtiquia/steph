import * as tui from "./lib/simple-tui"

export async function mainAsync(): Promise<Error | null> {
    console.log("TODO: TUI")

    tui.setup({
        onKeypress: (keypress) => {
            // typically safe for typing
            if (keypress.text)
                console.log("Text:", keypress.text);

            // for special keys like arrows etc
            else
                console.log("Key:", keypress.key.name ?? keypress.key.sequence);
        }
    })

    return null
}

