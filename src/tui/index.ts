import * as tui from "./lib/simple-tui"

export async function mainAsync(): Promise<Error | null> {
    tui.setup({
        onInput: (key) => {
            if (tui.isSpecialKey(key)) {
                console.log("Special Key: " + tui.tryGetSpecialKeyName(key).name);
            }
            else {
                console.log("Key: " + key);
            }

        }
    })

    console.log("TODO: TUI")
    return null
}

