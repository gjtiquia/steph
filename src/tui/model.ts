import * as tea from "./lib/lemontea";

// TODO : when the use-case arises, onKeypress should become a generic onEvent
// TODO : i have a feeling this can

export function createRootModel(): tea.IModel {

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
        createListModel(
            "this is a list with options",
            [
                "option 1",
                "option 2",
                "option 3",
            ]
        ),
    ]

    function onKeypress(keypress: tea.ReadlineKeypress) {
        for (const model of models) {
            model.onKeypress(keypress)
        }
    }

    function render(): tea.RenderResult {
        const lines: string[] = []
        let cursor: tea.Cursor | null = null

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
export function createEmptyModel(): tea.IModel {
    function onKeypress(keypress: tea.ReadlineKeypress) {
    }

    return {
        onKeypress,
        render: () => ({
            lines: [],
            cursor: null,
        }),
    }
}

export function createStaticTextModel(lines: string[]): tea.IModel {
    return {
        ...createEmptyModel(),
        render: () => ({
            lines,
            cursor: null,
        }),
    }
}

export function createDynamicTextModel(linesGetter: () => string[]): tea.IModel {
    return {
        ...createEmptyModel(),
        render: () => ({
            lines: linesGetter(),
            cursor: null,
        }),
    }
}

export function createListModel(title: string, options: string[]): tea.IModel {
    let selectedIndex = 0

    function onKeypress(keypress: tea.ReadlineKeypress) {
        const isUp = keypress.key.name === "up" || keypress.text === "k"
        const isDown = keypress.key.name === "down" || keypress.text === "j"

        if (isUp)
            selectedIndex = Math.max(0, selectedIndex - 1)
        else if (isDown && options.length > 0)
            selectedIndex = Math.min(options.length - 1, selectedIndex + 1)
    }

    function render(): tea.RenderResult {
        const lines = [
            title,
            "",
            ...options.map((option, index) => {
                const marker = index === selectedIndex ? ">" : " "
                return `${marker} ${index + 1}) ${option}`
            }),
        ]

        return { lines, cursor: null }
    }

    return {
        onKeypress,
        render,
    }
}

// example dynamic model
export function createExampleInputModel(): tea.IModel {
    const inputPrefix = "Type: "
    let text = ""
    let cursorIndex = 0
    let lastInput = "waiting input..."
    let ownsCursor = false

    function onKeypress(keypress: tea.ReadlineKeypress) {
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

    function render(): tea.RenderResult {
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

export function createExamplePropsGetterOnlyModel(countGetter: () => number): tea.IModel {
    return createDynamicTextModel(() => ["count: " + countGetter() + " (this is using shared state)"])
}

export function createExamplePropsSetterModel(countGetter: () => number, countSetter: (count: number) => void): tea.IModel {
    return {
        ...createEmptyModel(),
        onKeypress: () => countSetter(countGetter() + 1),
        render: () => ({
            lines: ["count: " + countGetter() + " (press any key to increment)",],
            cursor: null,
        }),
    }
}
