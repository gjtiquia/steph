export type Tree =
    | { type: "text"; text: string }
    | { type: "input"; prefix: string; value: string; cursor: number; showCursor: boolean }
    | { type: "list"; title: string; options: string[]; selectedIndex: number }
    | { type: "section"; children: Tree[] };
