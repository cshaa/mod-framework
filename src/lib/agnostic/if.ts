import type { Signal } from "@mod.js/signals";
import type { Mountable } from "../types";
import { Component } from "..";
import { Fragment } from "./fragment";
import { RenderContext } from "./context";

export interface IfProps<Context> {
	cond: Signal<boolean>;
	then: Mountable<Context>;
	else?: Mountable<Context>;
}

const IfInner = <Context>({
	cond,
	then,
	else: else_,
}: IfProps<Context>): Mountable<Context> => ({
	mount(ctx) {
		let unmount: (() => void) | undefined;
		const unsub = cond.subscribe(($cond) => {
			unmount?.();
			unmount = $cond ? then.mount(ctx) : else_?.mount(ctx);
		});

		return () => {
			unsub();
			unmount?.();
		};
	},
});

export const If = Component(
	<Context extends RenderContext>(props: IfProps<Context>) =>
		Fragment([IfInner(props)]),
);
