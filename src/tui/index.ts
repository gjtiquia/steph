import * as tui from "./lib/simple-tui"

export async function mainAsync(): Promise<Error | null> {
    tui.setup({
        onInput: (key) => {
            console.log("Key:" + JSON.stringify(key));
        }
    })

    console.log("TODO: TUI")
    return null
}

