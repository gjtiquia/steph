import type { Msg } from "../../../shared";

const KEY_MAP: Record<string, string> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    Enter: "return",
    " ": "space",
    Backspace: "backspace",
    Tab: "tab",
    Escape: "escape",
};

export function fromKeydown(e: KeyboardEvent): Msg[] {
    if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") {
        return [];
    }
    const name = KEY_MAP[e.key] ?? e.key;
    const text = name === "space" ? " " : name.length === 1 ? name : undefined;
    return [{ type: "Keypress", name, text }];
}

export function fromClick(e: MouseEvent): Msg[] {
    if (!(e.target instanceof Element)) return [];
    const el = e.target.closest("[data-index]");
    if (!el) return [];
    const indexAttr = el.getAttribute("data-index");
    if (indexAttr === null) return [];
    const index = Number(indexAttr);
    return [{ type: "Select", index }];
}
