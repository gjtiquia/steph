// lemontea, a TUI framework inspired by bubbletea, with HK roots
// intentionally decoupled from simple-tui

import * as t from "./simple-tui";

// TODO : eventually we'll need to handle terminal size and resizing

export type ReadlineKeypress = t.ReadlineKeypress;

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

export async function runAsync(m: IModel): Promise<Error[] | null> {
    clearUI();
    drawUI(m);

    t.setup({
        // isDebugMode: true,
        callProcessExit: false, // root main owns process exit to handle all errors gracefully
        onKeypress: (kp) => handleKeypress(kp, m),
        onCleanup: () => onBeforeCleanup(m),
    });

    const { ok, errors } = await t.tryRunAsync();
    if (!ok) return errors;

    return null;
}

function handleKeypress(keypress: t.ReadlineKeypress, m: IModel) {
    clearUI(); // clear first so that... we can cheat using console.log onKeypress
    m.onKeypress(keypress);
    drawUI(m);
}

function onBeforeCleanup(m: IModel) {
    // final render
    clearUI();
    const render = drawUI(m);
    if (render) {
        // move cursor to the last row
        // because, it may clear everything below wherever the cursor is at right now
        t.moveCursorTo(render.lines.length, 0);
    }
}

function clearUI() {
    console.clear();
}

function drawUI(m: IModel) {
    const result = m.render();

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
