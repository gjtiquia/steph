import { parseArgs } from "util";

main()

function main() {
    const { values, positionals } = parseArgs({
        args: Bun.argv,
        options: {
            port: {
                type: "string",
            },
        },
        strict: true,
        allowPositionals: true,
    });

    const bunPath = positionals[0]
    const scriptPath = positionals[1]
    const maybeCommand = positionals[2]

    if (maybeCommand === undefined) {
        console.log("TODO: default TUI behavior")
        return;
    }

    if (maybeCommand === "web") {
        const port = values.port ?? 3000;

        console.log("TODO: web behavior")
        console.log("port:", port)
        return;

    }

    console.log("TODO: help behavior")
}
