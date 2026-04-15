/**
 * Elementor Builder
 * Recursive conversion engine to convert Figma nodes to Elementor structure
 */

import { WidgetBase } from '@/types/widget';
import { FigmaNode } from '@/types/elementor';
import { createWidgetFromFigmaNode, hasImageFill } from './widgetFactory';
import { shouldConvertNode, isContainerNode } from '@/config/widgetsConfig';

/**
 * Recursively convert Figma nodes to Elementor elements
 */
export function convertFigmaToElementor(
	figmaNode: FigmaNode,
	depth: number = 0
): WidgetBase | null {
	// Skip if node should not be converted

	if (!shouldConvertNode(figmaNode)) {
		console.log(
			`Skipping node: ${figmaNode.type} - ${figmaNode.name || 'unnamed'}`
		);
		return null;
	}

	// Special handling for RECTANGLE with image fill
	if (figmaNode.type === 'RECTANGLE' && hasImageFill(figmaNode)) {
		// Convert to image widget
		return createWidgetFromFigmaNode(
			{ ...figmaNode, type: 'IMAGE' },
			depth
		);
	}

	// Create widget from node
	const widget = createWidgetFromFigmaNode(figmaNode, depth);
	console.log("🚀 ~ convertFigmaToElementor ~ widget:", widget)

	if (!widget) {
		return null;
	}

	// Process children for container nodes
	if (
		isContainerNode(figmaNode) &&
		figmaNode.children &&
		figmaNode.children.length > 0
	) {
		widget.elements = processChildren(figmaNode.children, depth + 1);
	}

	return widget;
}

/**
 * Process child nodes
 */
function processChildren(children: FigmaNode[], depth: number): WidgetBase[] {
	const elements: WidgetBase[] = [];

	for (const child of children) {
		const element = convertFigmaToElementor(child, depth);
		if (element) {
			elements.push(element);
		}
	}

	return elements;
}

/**
 * Convert multiple Figma nodes to Elementor elements
 */
export function convertMultipleFigmaNodes(
	figmaNodes: FigmaNode[],
	depth: number = 0
): WidgetBase[] {
	const elements: WidgetBase[] = [];
	console.log("🚀 ~ convertMultipleFigmaNodes ~ figmaNodes:", figmaNodes)

	for (const node of figmaNodes) {
		const element = convertFigmaToElementor(node, depth);
		if (element) {
			elements.push(element);
		}
	}

	return elements;
}

/**
 * Convert Figma frame to root container
 */
export function convertFigmaFrameToContainer(
	figmaFrame: FigmaNode
): WidgetBase | null {
	console.log("🚀 ~ convertFigmaFrameToContainer ~ figmaFrame:", figmaFrame)
	// Ensure it's a frame or group
	if (figmaFrame.type !== 'FRAME' && figmaFrame.type !== 'GROUP') {
		console.error('Root node must be a FRAME or GROUP');
		return null;
	}

	return convertFigmaToElementor(figmaFrame, 0);
}
