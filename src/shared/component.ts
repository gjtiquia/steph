import type { Model, Msg } from "./types";
import type { Tree } from "./tree";

export type Component<Props> = {
    key: string;
    init(): Props;
    update(msg: Msg, props: Props, model: Model): { props: Props; changed: boolean };
    view(props: Props, model: Model): Tree;
};
