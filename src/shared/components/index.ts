import type { Component } from "../component";
import { staticText } from "./staticText";
import { input } from "./input";
import { keyDisplay } from "./keyDisplay";
import { countGetter, countSetter } from "./count";
import { list } from "./list";

export { staticText, input, keyDisplay, countGetter, countSetter, list };

export const homeScreen: Component<unknown>[] = [
    staticText,
    input,
    keyDisplay,
    countGetter,
    countSetter,
    list,
];
