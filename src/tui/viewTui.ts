import type { Model, Tree } from "../shared";
import { homeScreen, modelFieldFor } from "../shared";

export function viewTui(model: Model): {
    lines: string[];
    cursor: { row: number; col: number } | null;
} {
    const lines: string[] = [];
    let cursor: { row: number; col: number } | null = null;

    function flatten(tree: Tree) {
        if (tree.type === "text") {
            lines.push(tree.text);
        } else if (tree.type === "input") {
            const row = lines.length;
            lines.push(tree.prefix + tree.value);
            if (tree.showCursor && !cursor) {
                cursor = { row, col: tree.prefix.length + tree.cursor };
            }
        } else if (tree.type === "list") {
            lines.push(tree.title);
            lines.push("");
            tree.options.forEach((option, index) => {
                const marker = index === tree.selectedIndex ? ">" : " ";
                lines.push(`${marker} ${index + 1}) ${option}`);
            });
        } else if (tree.type === "section") {
            for (const child of tree.children) {
                flatten(child);
            }
        }
    }

    for (const component of homeScreen) {
        const field = modelFieldFor[component.key];
        if (!field) continue;
        flatten(component.view(model[field], model));
    }

    return { lines, cursor };
}
