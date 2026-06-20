
export function tryParseInt(value: string) {
    const parsedInt = parseInt(value)
    if (isNaN(parsedInt))
        return { ok: false } as const

    return { ok: true, parsedInt } as const
}
