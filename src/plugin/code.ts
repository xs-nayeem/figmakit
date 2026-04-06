// This code runs in Figma's plugin sandbox
// It has access to the Figma API but no browser/DOM APIs

import { serializeNode } from "./serializer";

figma.showUI(__html__, { width: 400, height: 600 });

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
	if (msg.type === 'get-figma-nodes') {
		try {
			// Get only selected nodes
			const selection = figma.currentPage.selection;

			if (!selection || selection.length === 0) {
				figma.ui.postMessage({
					type: 'error',
					message:
						'No nodes selected. Please select one or more nodes.',
				});
				return;
			}

			const nodes = selection.map((node) => serializeNode(node));

			// Send back to UI
			figma.ui.postMessage({
				type: 'figma-nodes-data',
				nodes: nodes,
			});
		} catch (error) {
			figma.ui.postMessage({
				type: 'error',
				message:
					error instanceof Error
						? error.message
						: 'Failed to read nodes',
			});
		}
	}
};
