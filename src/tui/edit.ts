export function applyKeypress(
    k: { name: string; text: string | undefined },
    value: string,
    cursor: number,
): { value: string; cursor: number } | null {
    if (k.name === "backspace") {
        value = value.slice(0, Math.max(0, cursor - 1)) + value.slice(cursor);
        cursor = Math.max(0, cursor - 1);
        return { value, cursor };
    }

    if (k.name === "left") {
        cursor = Math.max(0, cursor - 1);
        return { value, cursor };
    }

    if (k.name === "right") {
        cursor = Math.min(value.length, cursor + 1);
        return { value, cursor };
    }

    if (k.text && k.text.length > 0) {
        value = value.slice(0, cursor) + k.text + value.slice(cursor);
        cursor += k.text.length;
        return { value, cursor };
    }

    return null;
}
