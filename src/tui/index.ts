import * as tui from "./lib/simple-tui"

export async function mainAsync(): Promise<Error | null> {
    console.log("TODO: TUI")

    const { ok, error } = tui.trySetup({
        onKeypress: (keypress) => {
            // typically safe for typing
            if (keypress.text)
                console.log("Text:", keypress.text);

            // for special keys like arrows etc.
            else
                console.log("Key:", keypress.key.name ?? keypress.key.sequence);
        }
    })

    if (!ok)
        return error

    return null
}

