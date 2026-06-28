import * as t from "./lib/simple-tui"
import { createRootModel } from "./model"

export interface IModel {
    isCursorVisible(): boolean
    onKeypress(keypress: t.Keypress): void
    getLines(): string[]
}

const model: IModel = createRootModel()

export async function mainAsync(): Promise<Error | null> {
    clearUI()
    drawUI()

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
    clearUI() // clear first so that... we can cheat using console.log onKeypress
    model.onKeypress(keypress)
    drawUI();
}

function clearUI() {
    console.clear()
}

function drawUI() {
    for (const line of model.getLines()) {
        console.log(line)
    }

    if (model.isCursorVisible())
        t.showCursor()
    else
        t.hideCursor()
}

