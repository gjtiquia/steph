// (GJ) ported from early Bun TS version of github.com/gjtiquia/curly
// seems reusable enough to be a simple TUI lib

export const KeyUpArrow = "\u001b[A"
export const KeyDownArrow = "\u001b[B"
export const KeyLeftArrow = "\u001b[D"
export const KeyRightArrow = "\u001b[C"

// keep this flat so defaults can be merged with a simple spread operator
type Options = {
    clearOnExit: boolean
    onInput: (key: string) => void
}

export function createDefaultOptions(): Options {
    return {
        clearOnExit: false,
        onInput: () => { }
    }
}

let globalOptions: Options = createDefaultOptions()

export function setup(options: Partial<Options>) {
    globalOptions = {
        ...createDefaultOptions(),
        ...options
    }

    process.stdin.setRawMode(true)
    process.stdin.resume(); // necessary or else "data" event wont fire
    process.stdin.setEncoding("utf8") // so can do string comparison on received keypresses

    // cleanup listeners
    process.on("exit", cleanup); // Regular exit on program end
    process.on("SIGINT", cleanupAndExit); // Ctrl-C, does not exit by default, need to manually exit
    process.on("SIGTERM", cleanupAndExit); // Terminated by terminal

    // input listeners
    process.stdin.on("data", (key: string) => {
        // Ctrl+C sends character code 3
        if (key === "\u0003") {
            process.kill(process.pid, "SIGINT");
            return;
        }

        globalOptions.onInput(key);
    });
}

function cleanup() {
    process.stdin.setRawMode(false)

    if (globalOptions.clearOnExit)
        console.clear();
}

function cleanupAndExit() {
    cleanup();
    process.exit(0);
}

function onInput(key: string) {
    globalOptions.onInput(key)
    console.log("Key:" + JSON.stringify(key));
}
