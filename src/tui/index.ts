import * as t from "./lib/simple-tui"

export async function mainAsync(): Promise<Error | null> {
    console.log("TODO: TUI")

    t.setup({
        // isDebugMode: true,
        callProcessExit: false,
        onKeypress: (keypress) => {
            // typically safe for typing
            if (keypress.text)
                console.log("Text:", keypress.text);

            // for special keys like arrows etc.
            else
                console.log("Key:", keypress.key.name ?? keypress.key.sequence);
        }
    })

    const { ok, error } = await t.tryRunAsync()
    if (!ok)
        return error

    return null
}


