import type { Cursor, IModel, RenderResult } from ".";
import type { Keypress } from "./lib/simple-tui";

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

    function render(): RenderResult {
        const lines: string[] = []
        let cursor: Cursor | null = null

        for (const model of models) {
            const result = model.render()

            // the first model that claims the cursor owns the cursor
            // if no model claims the cursor, no cursor shown
            if (!cursor && result.cursor) {
                cursor = {
                    row: lines.length + result.cursor.row,
                    col: result.cursor.col,
                }
            }

            lines.push(...result.lines)
        }

        return { lines, cursor }
    }

    return {
        onKeypress,
        render,
    }
}

// imperative programming with React-style syntax
// can be used as a template
export function createEmptyModel(): IModel {
    function onKeypress(keypress: Keypress) {
    }

    return {
        onKeypress,
        render: () => ({
            lines: [],
            cursor: null,
        }),
    }
}

export function createStaticTextModel(lines: string[]): IModel {
    return {
        ...createEmptyModel(),
        render: () => ({
            lines,
            cursor: null,
        }),
    }
}

export function createDynamicTextModel(linesGetter: () => string[]): IModel {
    return {
        ...createEmptyModel(),
        render: () => ({
            lines: linesGetter(),
            cursor: null,
        }),
    }
}

// example dynamic model
export function createExampleInputModel(): IModel {
    const inputPrefix = "Type: "
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

    function render(): RenderResult {
        const lines = [
            inputPrefix + text,
            lastInput,
        ]

        if (!ownsCursor)
            return { lines, cursor: null }

        return {
            lines,
            cursor: {
                row: 0,
                col: inputPrefix.length + cursorIndex,
            },
        }
    }

    return {
        onKeypress,
        render,
    }
}

export function createExamplePropsGetterOnlyModel(countGetter: () => number): IModel {
    return createDynamicTextModel(() => ["count: " + countGetter() + " (this is using shared state)"])
}

export function createExamplePropsSetterModel(countGetter: () => number, countSetter: (count: number) => void): IModel {
    return {
        ...createEmptyModel(),
        onKeypress: () => countSetter(countGetter() + 1),
        render: () => ({
            lines: ["count: " + countGetter() + " (press any key to increment)",],
            cursor: null,
        }),
    }
}
