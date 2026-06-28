import * as tui from "./lib/simple-tui"

export async function mainAsync(): Promise<Error | null> {
    tui.setup({
        onInput: (key) => {
            if (tui.isSpecialKey(key)) {
                switch (key) {
                    case tui.SpecialKey.UpArrow:
                        console.log("UpArrow pressed");
                        break;

                    case tui.SpecialKey.DownArrow:
                        console.log("DownArrow pressed");
                        break;

                    case tui.SpecialKey.LeftArrow:
                        console.log("LeftArrow pressed");
                        break;

                    case tui.SpecialKey.RightArrow:
                        console.log("RightArrow pressed");
                        break;

                    default:
                        console.log("Unknown special key pressed");
                }
            }
            else {
                console.log("Key:" + JSON.stringify(key));
            }

        }
    })

    console.log("TODO: TUI")
    return null
}

