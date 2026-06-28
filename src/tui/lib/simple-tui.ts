// (GJ) ported from early Bun TS version of github.com/gjtiquia/curly
// seems reusable enough to be a simple TUI lib

// works in Bun: https://bun.com/reference/node/readline
import readline from "node:readline"

export type Keypress = {
    text: string | undefined,
    key: readline.Key
}

// keep this flat so defaults can be merged with a simple spread operator
type Options = {
    clearOnExit: boolean
    onKeypress: (keypress: Keypress) => void
}

export function createDefaultOptions(): Options {
    return {
        clearOnExit: false, // false by default, reduces WTF/min
        onKeypress: () => { }
    }
}

let globalOptions: Options = createDefaultOptions()

let hasSetupSuccessfully = false

export function trySetup(options: Partial<Options> = {}) {
    if (!process.stdin.isTTY) // might be undefined, so safer to check for falsy value, despite the type being a boolean... test by piping into the program
        return { ok: false, error: new Error("stdin is not a TTY") } as const

    if (hasSetupSuccessfully)
        return { ok: false, error: new Error("TUI has already setup successfully") } as const

    globalOptions = {
        ...createDefaultOptions(),
        ...options
    }

    // allows process.stdin to emit "keypress" events, which is necessary for reading special keys like arrow keys
    readline.emitKeypressEvents(process.stdin)

    process.stdin.setRawMode(true)
    process.stdin.resume(); // necessary or else "keypress" event wont fire
    process.stdin.setEncoding("utf8") // so can do string comparison on received keypresses

    // cleanup listeners
    process.on("exit", cleanup); // Regular exit on program end
    process.on("SIGINT", cleanupAndExit); // Ctrl-C, does not exit by default, need to manually exit
    process.on("SIGTERM", cleanupAndExit); // Terminated by terminal

    // input listeners
    process.stdin.on("keypress", (text: string | undefined, key: readline.Key) => {
        if (key.ctrl && key.name === "c") {
            process.kill(process.pid, "SIGINT");
            return;
        }

        globalOptions.onKeypress({ text, key });
    });

    hasSetupSuccessfully = true
    return { ok: true } as const
}

let hasCleanedUpSuccessfully = false

function cleanup() {
    if (hasCleanedUpSuccessfully)
        return

    process.stdin.setRawMode(false)

    if (globalOptions.clearOnExit)
        console.clear();

    hasCleanedUpSuccessfully = true
}

function cleanupAndExit() {
    cleanup();
    process.exit(0);
}

