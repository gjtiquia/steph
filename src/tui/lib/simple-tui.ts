// (GJ) ported from early Bun TS version of github.com/gjtiquia/curly
// seems reusable enough to be a simple TUI lib

// works in Bun: https://bun.com/reference/node/readline
import readline from "node:readline"

// keep this flat so defaults can be merged with a simple spread operator
type Options = {
    isDebugMode: boolean,
    clearOnStart: boolean,
    clearOnExit: boolean,
    callProcessExit: boolean,
    onKeypress: (keypress: Keypress) => void
}

export function createDefaultOptions(): Options {
    return {
        isDebugMode: false, // false by default, reduce noise
        clearOnStart: false, // false by default, reduces WTF/min, prefer explicit intentional behavior than magic
        clearOnExit: false, // false by default, reduces WTF/min, prefer explicit intentional behavior than magic
        callProcessExit: true, // true by default, reduces WTF/min, so that the program exits when the user presses Ctrl-C, unless the user wants to handle it themselves
        onKeypress: () => { }
    }
}

let globalOptions: Options = createDefaultOptions()

export function setup(options: Partial<Options> = {}) {
    globalOptions = {
        ...createDefaultOptions(),
        ...options
    }
}

let hasStartedRunningSuccessfully = false

type Success = { readonly ok: true, readonly error: undefined }
type Failure = { readonly ok: false, readonly error: Error }
type Result = Success | Failure

let resolveRunPromise: (result: Result) => void = (result) => { }

export async function tryRunAsync(): Promise<Result> {
    if (!process.stdin.isTTY) // might be undefined, so safer to check for falsy value, despite the type being a boolean... test by piping into the program
        return { ok: false, error: new Error("stdin is not a TTY") } as const

    if (hasStartedRunningSuccessfully)
        return { ok: false, error: new Error("TUI is already running") } as const

    debug("tryRunAsync: running...")

    const runPromise = new Promise<Result>((resolve) => {
        resolveRunPromise = resolve
    })

    // allows process.stdin to emit "keypress" events, which is necessary for reading special keys like arrow keys
    readline.emitKeypressEvents(process.stdin)

    process.stdin.setRawMode(true)
    process.stdin.resume(); // necessary or else "keypress" event wont fire
    process.stdin.setEncoding("utf8") // so can do string comparison on received keypresses

    // input listeners
    process.stdin.on("keypress", onKeypress)

    // cleanup listeners
    process.on("exit", requestCleanupSuccess); // Regular exit on program end
    process.on("SIGINT", requestCleanupSuccessAndExit); // Ctrl-C, does not exit by default, need to manually exit
    process.on("SIGTERM", requestCleanupSuccessAndExit); // Terminated by terminal

    if (globalOptions.clearOnStart)
        console.clear();

    hasStartedRunningSuccessfully = true

    debug("tryRunAsync: waiting exit request...")
    const result = await runPromise

    debug("tryRunAsync: exiting...")
    return result
}

export type Keypress = {
    text: string | undefined,
    key: readline.Key
}

function onKeypress(text: string | undefined, key: readline.Key) {
    if (key.ctrl && key.name === "c") {
        process.kill(process.pid, "SIGINT");
        return;
    }

    // try/catch wrap cuz you never know what the user will do in their onKeypress callback, and we want to make sure we clean up properly if they throw an error
    try {
        globalOptions.onKeypress({ text, key });
    } catch (error) {
        if (error instanceof Error)
            requestCleanupError(error)
        else
            requestCleanupError(new Error(String(error)))
    }
}

// exported so that users can call it themselves if they want to handle process exit themselves
export function requestExit() {
    requestCleanupSuccessAndExit();
}

function requestCleanupSuccessAndExit() {
    debug("cleanupAndExit: running...")

    requestCleanupSuccess();

    debug("cleanupAndExit: exiting...")

    if (globalOptions.callProcessExit)
        process.exit(0);
}

function requestCleanupSuccess() {
    requestCleanup({ ok: true, error: undefined })
}

function requestCleanupError(error: Error) {
    requestCleanup({ ok: false, error: error })
}

let hasAttemptedCleanup = false

function requestCleanup(result: Result) {
    if (hasAttemptedCleanup) {
        debug("cleanup: already attempted, skipping...")
        return
    }

    hasAttemptedCleanup = true

    debug("cleanup: running...")

    if (process.stdin.isTTY)
        process.stdin.setRawMode(false)

    if (globalOptions.clearOnExit)
        console.clear();

    resolveRunPromise(result)

    debug("cleanup: success!")
}

function debug(msg: string) {
    if (globalOptions.isDebugMode)
        console.log("[simple-tui]", msg)
}

