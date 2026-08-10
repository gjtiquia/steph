import { printErrors } from "../lib/try-catch";
import * as tea from "./lib/lemontea";
import { init, update } from "../shared";
import { fromTuiKeys } from "./fromTuiKeys";
import { viewTui } from "./viewTui";

export async function mainAsync(): Promise<Error[] | null> {
    let model = init();
    const teaModel: tea.IModel = {
        onKeypress(keypress) {
            for (const msg of fromTuiKeys(keypress, model)) {
                model = update(msg, model).model;
            }
        },
        render() {
            return viewTui(model);
        },
    };
    const errors = await tea.runAsync(teaModel);

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
