import { Unsubscriber } from "@mod.js/signals";
import { Mountable } from "..";
import { RenderContext } from "./context";

export const Fragment = <Context extends RenderContext>(
	children: Mountable<Context>[],
): Mountable<Context> => ({
	mount(ctx) {
		const anchor = ctx.createAnchor();
		const unmountChildren: Unsubscriber[] = [];

		for (const child of children) {
			unmountChildren.push(child.mount(anchor.context));
		}

		return () => {
			for (const u of unmountChildren) u();
			anchor.unmount();
		};
	},
});
