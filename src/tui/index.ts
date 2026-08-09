import { printErrors } from "../lib/try-catch";
import * as tea from "./lib/lemontea";
import { createRootModel } from "./model";

export async function mainAsync(): Promise<Error[] | null> {
    const model = createRootModel();
    const errors = await tea.runAsync(model);

    if (errors !== null) {
        console.error("Errors caught gracefully");
        printErrors(errors);

        // we need to call it ourselves cuz the TUI does some process overrides
        process.exit(1);
    } else {
        // we need to call it ourselves cuz the TUI does some process overrides
        process.exit(0);
    }

    // the program should no longer bubble up from here as the process has either exited or thrown an error
    throw new Error("process.exit not called!");
    return errors;
}
