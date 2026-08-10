import type { Model, Msg } from "./types";
import type { Tree } from "./tree";

export type Widget<Slice> = {
    key: string;
    init(): Slice;
    update(msg: Msg, slice: Slice, model: Model): { slice: Slice; changed: boolean };
    view(slice: Slice, model: Model): Tree;
};
