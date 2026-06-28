import * as t from "./lib/simple-tui"
import { createRootModel } from "./model"
import * as readline from "node:readline"

// TODO : eventually we'll need to handle terminal size and resizing

// TODO : intentionally decoupled from simple-tui
// TODO : cuz i feel like, this is the beginnning of a TUI framework, inspired by bubbletea, i can call it lemontea!
// TODO : also, might need to consider web-portability, and this cant exactly run on the browser, so, we'll have to see how it goes
export type ReadlineKeypress = {
    text: string | undefined,
    key: readline.Key
}

export interface IModel {
    onKeypress(keypress: ReadlineKeypress): void
    render(): RenderResult
}

export type RenderResult = {
    lines: string[]
    cursor: Cursor | null
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

function handleKeypress(keypress: t.ReadlineKeypress) {
    clearUI() // clear first so that... we can cheat using console.log onKeypress
    model.onKeypress(keypress)
    drawUI();
}

function clearUI() {
    console.clear()
}

function drawUI() {
    const result = model.render()

    for (const line of result.lines) {
        console.log(line)
    }

    const cursor = result.cursor
    if (cursor) {
        t.moveCursorTo(cursor.row, cursor.col)
        t.showCursor()
    }
    else {
        t.hideCursor()
    }
}
