// This code runs in Figma's plugin sandbox
// It has access to the Figma API but no browser/DOM APIs

import { serializeNode } from "./serializer";

figma.showUI(__html__, { width: 400, height: 600 });

function sanitizeForPostMessage(value: unknown, seen = new WeakSet<object>()): unknown {
	if (value === null || value === undefined) {
		return value;
	}

	if (typeof value === "symbol") {
		return "mixed";
	}

	if (typeof value === "bigint") {
		return value.toString();
	}

	if (typeof value !== "object") {
		return value;
	}

	if (Array.isArray(value)) {
		return value.map((item) => sanitizeForPostMessage(item, seen));
	}

	const obj = value as Record<string, unknown>;
	if (seen.has(obj)) {
		return undefined;
	}
	seen.add(obj);

	const sanitized: Record<string, unknown> = {};
	for (const [key, raw] of Object.entries(obj)) {
		if (typeof raw === "function") {
			continue;
		}

		const next = sanitizeForPostMessage(raw, seen);
		if (next !== undefined) {
			sanitized[key] = next;
		}
	}

	return sanitized;
}

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

			const nodes = selection.map((node) => sanitizeForPostMessage(serializeNode(node)));

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
