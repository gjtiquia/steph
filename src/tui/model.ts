import type { Cursor, IModel } from ".";
import type { Keypress } from "./lib/simple-tui";

// TODO : lines and cursor should collapse into a single render result object, cuz cursor position relies on line count, should not need to calculate lines twice
// TODO : when the use-case arises, onKeypress should become a generic onEvent

export function createRootModel(): IModel {

    let exampleSharedCount = 0

    // TODO : history, title, dashboard, url, ui, footer
    const models = [
        createStaticTextModel([
            "",
            "steph",
            "",
        ]),
        createExampleInputModel(),
        createExamplePropsGetterOnlyModel(() => exampleSharedCount),
        createExamplePropsSetterModel(() => exampleSharedCount, (count) => exampleSharedCount = count),
    ]

    function onKeypress(keypress: Keypress) {
        for (const model of models) {
            model.onKeypress(keypress)
        }
    }

    function getLines(): string[] {
        const lines: string[] = []
        for (const model of models) {
            lines.push(...model.getLines())
        }
        return lines
    }

    function getCursor(): Cursor | null {
        let rowOffset = 0
        for (const model of models) {
            const cursor = model.getCursor()

            // the first model that claims the cursor owns the cursor
            if (cursor) {
                return {
                    row: rowOffset + cursor.row,
                    col: cursor.col,
                }
            }

            rowOffset += model.getLines().length
        }

        // no model claims the cursor, no cursor shown
        return null
    }

    return {
        onKeypress,
        getLines,
        getCursor,
    }
}

// imperative programming with React-style syntax
// can be used as a template
export function createEmptyModel(): IModel {
    function onKeypress(keypress: Keypress) {
    }

    function getLines(): string[] {
        return []
    }

    return {
        onKeypress,
        getLines,
        getCursor: () => null,
    }
}

export function createStaticTextModel(lines: string[]): IModel {
    return {
        ...createEmptyModel(),
        getLines: () => lines,
    }
}

export function createDynamicTextModel(linesGetter: () => string[]): IModel {
    return {
        ...createEmptyModel(),
        getLines: linesGetter,
    }
}

// example dynamic model
export function createExampleInputModel(): IModel {
    let text = ""
    let cursorIndex = 0
    let lastInput = "waiting input..."
    let ownsCursor = false

    function onKeypress(keypress: Keypress) {
        // console.log(keypress)

        // hard guard for backspace, weirdly keypress.text.length == 1
        if (keypress.key.name === "backspace") {
            text = text.slice(0, Math.max(0, cursorIndex - 1)) + text.slice(cursorIndex)
            cursorIndex = Math.max(0, cursorIndex - 1)
            lastInput = "Special: Backspace"
            ownsCursor = true
        }

        else if (keypress.key.name === "left") {
            cursorIndex = Math.max(0, cursorIndex - 1)
            lastInput = "Special: Left"
            ownsCursor = true
        }

        else if (keypress.key.name === "right") {
            cursorIndex = Math.min(text.length, cursorIndex + 1)
            lastInput = "Special: Right"
            ownsCursor = true
        }

        // typically safe for typing
        else if (keypress.text && keypress.text.length > 0) {
            text = text.slice(0, cursorIndex) + keypress.text + text.slice(cursorIndex)
            cursorIndex += keypress.text.length
            lastInput = "Text: " + keypress.text
            ownsCursor = true
        }

        // for special keys like arrows etc.
        else {
            lastInput = "Key: " + (keypress.key.name ?? keypress.key.sequence)
            ownsCursor = false
        }
    }

    function getLines(): string[] {
        return [
            "Type: " + text,
            lastInput,
        ]
    }

    function getCursor(): Cursor | null {
        if (!ownsCursor)
            return null

        return {
            row: 0,
            col: "Type: ".length + cursorIndex,
        }
    }

    return {
        onKeypress,
        getLines,
        getCursor,
    }
}

export function createExamplePropsGetterOnlyModel(countGetter: () => number): IModel {
    return createDynamicTextModel(() => ["count: " + countGetter() + " (this is using shared state)"])
}

export function createExamplePropsSetterModel(countGetter: () => number, countSetter: (count: number) => void): IModel {
    return {
        ...createEmptyModel(),
        onKeypress: () => countSetter(countGetter() + 1),
        getLines: () => ["count: " + countGetter() + " (press any key to increment)",],
    }
}
