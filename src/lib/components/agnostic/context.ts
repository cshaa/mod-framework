export interface RenderContext {
	createAnchor(): { context: any; unmount: () => void };
}
