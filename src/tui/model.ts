import type { IModel } from ".";
import type { Keypress } from "./lib/simple-tui";

// TODO : lines and cursor should collapse into a single render result object, cuz cursor position relies on line count, should not need to calculate lines twice

export function createRootModel(): IModel {

    let exampleSharedCount = 0

    // TODO : history, title, dashboard, url, ui, footer
    const models = [
        createStaticTextModel([
            "",
            "steph",
            "",
        ]),
        createExampleDynamicModel(),
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

    function isCursorVisible(): boolean {
        for (const model of models) {
            // if at least one model has a visible cursor, then the cursor is visible
            if (model.isCursorVisible())
                return true
        }
        // if all models have no visible cursor, then the cursor is not visible
        return false
    }

    return {
        isCursorVisible,
        onKeypress,
        getLines,
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
        isCursorVisible: () => false,
        onKeypress,
        getLines,
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
export function createExampleDynamicModel(): IModel {
    let text = ""
    let lastInput = "waiting input..."
    let showCursor = false

    function onKeypress(keypress: Keypress) {
        // console.log(keypress)

        // hard guard for backspace, weirdly keypress.text.length == 1
        if (keypress.key.name === "backspace") {
            text = text.slice(0, -1)
            lastInput = "Special: Backspace"
            showCursor = true // TODO : needa figure out cursor position during typing
        }

        // typically safe for typing
        else if (keypress.text && keypress.text.length > 0) {
            text += keypress.text
            lastInput = "Text: " + keypress.text
            showCursor = true // TODO : needa figure out cursor position during typing
        }

        // for special keys like arrows etc.
        else {
            lastInput = "Key: " + (keypress.key.name ?? keypress.key.sequence)
            showCursor = false
        }
    }

    function getLines(): string[] {
        return [
            "Type: " + text,
            lastInput,
        ]
    }

    return {
        isCursorVisible: () => showCursor,
        onKeypress,
        getLines,
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

