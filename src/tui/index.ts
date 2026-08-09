import * as tea from "./lib/lemontea"
import * as t from "./lib/simple-tui"
import { createRootModel } from "./model"
import * as readline from "node:readline"

export async function mainAsync(): Promise<Error[] | null> {
    const model = createRootModel()
    return tea.runAsync(model)
}
