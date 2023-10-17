import { RenderContext } from "../agnostic/context";

export interface DomContext extends RenderContext {
	domDocument: Document;
	domParent: Element;
	domNextNode?: Node;
	createAnchor(): {
		context: DomContext;
		unmount: () => void;
	};
}

export const isDomContext = (ctx: unknown): ctx is DomContext =>
	typeof ctx === "object" &&
	ctx !== null &&
	"domDocument" in ctx &&
	"domParent" in ctx &&
	"createAnchor" in ctx &&
	typeof ctx.createAnchor === "function";

export const DomContext = ({
	document,
	root,
}: {
	document?: Document;
	root?: Element | string;
}): DomContext => {
	document ??=
		typeof root === "object"
			? root.ownerDocument
			: globalThis.document;

	if (typeof root !== "object") {
		root =
			typeof root === "string"
				? document.querySelector(root)!
				: document.body;
	}

	const domDocument = document;
	const domParent = root;

	const createAnchor = () => {
		const domNextNode = domDocument.createTextNode("");
		domParent.appendChild(domNextNode);

		const unmount = () => domNextNode.remove();
		const context = {
			domDocument,
			domParent,
			domNextNode,
			createAnchor,
		};
		return { context, unmount };
	};

	return {
		domDocument,
		domParent,
		createAnchor,
		domNextNode: undefined, // to overwrite parent's anchor
	};
};
