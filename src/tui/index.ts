import * as t from "./lib/simple-tui"
import { createModel } from "./model"

export interface IModel {
    onKeypress(keypress: t.Keypress): void
    getLines(): string[]
    isCursorVisible(): boolean
}

const model: IModel = createModel()

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
    model.onKeypress(keypress)
    updateUI();
}

function updateUI() {
    console.clear()

    for (const line of model.getLines()) {
        console.log(line)
    }

    if (model.isCursorVisible())
        t.showCursor()
    else
        t.hideCursor()
}

