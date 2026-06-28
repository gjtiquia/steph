// (GJ) ported from early Bun TS version of github.com/gjtiquia/curly
// seems reusable enough to be a simple TUI lib

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

export const SpecialKey = {
    UpArrow: "\u001b[A",
    DownArrow: "\u001b[B",
    LeftArrow: "\u001b[D",
    RightArrow: "\u001b[C",
} as const

export type SpecialKeyName = keyof typeof SpecialKey
export type SpecialKey = typeof SpecialKey[SpecialKeyName]

const specialKeyEntries = Object.entries(SpecialKey) as [SpecialKeyName, SpecialKey][]

// like a "reverse lookup" map, so can check if a key is a SpecialKey
// instead of simply a Set
const specialKeyNamesByValue = new Map<string, SpecialKeyName>(
    specialKeyEntries.map(([name, value]) => [value, name])
)

// type guard - if true, key is a SpecialKey. if false, key is a regular string
export function isSpecialKey(key: string): key is SpecialKey {
    return specialKeyNamesByValue.has(key)
}

export function tryGetSpecialKeyName(key: string) {
    const name = specialKeyNamesByValue.get(key)

    if (name === undefined)
        return { ok: false } as const

    return {
        ok: true,
        name
    } as const
}

