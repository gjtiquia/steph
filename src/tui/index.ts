import * as t from "./lib/simple-tui"
import { createRootModel } from "./model"

// TODO : eventually we'll need to handle terminal size and resizing

export interface IModel {
    onKeypress(keypress: t.Keypress): void
    getLines(): string[]
    getCursor(): Cursor | null
}

export type Cursor = {
    row: number
    col: number
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

    const cursor = model.getCursor()
    if (cursor) {
        t.moveCursorTo(cursor.row, cursor.col)
        t.showCursor()
    }
    else {
        t.hideCursor()
    }
}
