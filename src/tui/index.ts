import * as t from "./lib/simple-tui"

let title = "steph"
let text = "waiting input..."

export async function mainAsync(): Promise<Error | null> {
    updateUI()

    t.setup({
        // isDebugMode: true,
        callProcessExit: false, // root main owns process exit
        onKeypress: handleKeypress,
    })

    const { ok, error } = await t.tryRunAsync()
    if (!ok)
        return error

    return null
}

function handleKeypress(keypress: t.Keypress) {
    // typically safe for typing
    if (keypress.text)
        text = "Text: " + keypress.text

    // for special keys like arrows etc.
    else
        text = "Key: " + (keypress.key.name ?? keypress.key.sequence)

    updateUI();
}

function updateUI() {
    console.clear()
    console.log(title)
    console.log(text)
}

