import * as tea from "./lib/lemontea"
import { createRootModel } from "./model"

export async function mainAsync(): Promise<Error[] | null> {
    const model = createRootModel()
    return tea.runAsync(model)
}
