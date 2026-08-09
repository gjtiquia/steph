// lemontea, a TUI framework inspired by bubbletea, with HK roots
// intentionally decoupled from simple-tui

import * as t from "./simple-tui";
import * as readline from "node:readline";

// TODO : eventually we'll need to handle terminal size and resizing

export type ReadlineKeypress = {
    text: string | undefined;
    key: readline.Key;
};

export interface IModel {
    onKeypress(keypress: ReadlineKeypress): void;
    render(): RenderResult;
}

export type RenderResult = {
    lines: string[];
    cursor: Cursor | null;
};

export type Cursor = {
    row: number;
    col: number;
};

let model: IModel | undefined = undefined;

export async function runAsync(m: IModel): Promise<Error[] | null> {
    model = m;

    clearUI();
    drawUI();

    t.setup({
        // isDebugMode: true,
        callProcessExit: false, // root main owns process exit to handle all errors gracefully
        onKeypress: handleKeypress,
        onCleanup: onBeforeCleanup,
    });

    const { ok, errors } = await t.tryRunAsync();
    if (!ok) return errors;

    return null;
}

function handleKeypress(keypress: t.ReadlineKeypress) {
    clearUI(); // clear first so that... we can cheat using console.log onKeypress
    model?.onKeypress(keypress);
    drawUI();
}

function onBeforeCleanup() {
    // final render
    clearUI();
    const render = drawUI();
    if (render) {
        // move cursor to the last row
        // because, it may clear everything below wherever the cursor is at right now
        t.moveCursorTo(render.lines.length, 0);
    }
}

function clearUI() {
    console.clear();
}

function drawUI() {
    if (!model) return;

    const result = model.render();

    for (const line of result.lines) {
        console.log(line);
    }

    const cursor = result.cursor;
    if (cursor) {
        t.moveCursorTo(cursor.row, cursor.col);
        t.showCursor();
    } else {
        t.hideCursor();
    }

    return result;
}
