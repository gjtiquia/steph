import { parseArgs } from "util";
import * as tui from "./tui"
import * as web from "./web"
import * as utils from "./utils"

main()

function main() {
    mainAsync()
        .then((error) => {
            if (error !== null)
                console.error(error)
        })
        .catch((error) => {
            console.error(error)
        })
}

async function mainAsync(): Promise<Error | null> {
    // TODO :  this needs to wrap in a try-catch for legible errors
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
        return tui.mainAsync()
    }

    if (maybeCommand === "web") {
        let port = 3000;

        // PORT
        const envPort = process.env.PORT;

        // --port
        const argPort = values.port;

        // PORT takes precedence over --port
        if (envPort !== undefined) {
            const { ok, parsedInt } = utils.tryParseInt(envPort)
            if (!ok) return new Error(`web command: received PORT env variable but unable to parse ${envPort}!`)
            port = parsedInt
        }
        else if (argPort !== undefined) {
            const { ok, parsedInt } = utils.tryParseInt(argPort)
            if (!ok) return new Error(`web command: received --port arg but unable to parse ${argPort}!`)
            port = parsedInt
        }

        return web.mainAsync(port);
    }

    console.log("TODO: help behavior")
    return null;
}

