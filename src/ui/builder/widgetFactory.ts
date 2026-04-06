/**
 * Widget Factory
 * Creates Elementor widgets from Figma nodes
 */

import { WidgetBase } from '@/types/widget';
import { FigmaNode } from '@/types/elementor';
import { getFigmaMapper, isValidWidgetType } from '@/widgets';
import { createHeadingWidget } from '@/widgets/elementor/heading';
import { createImageWidget } from '@/widgets/elementor/image';
import { createContainerWidget } from '@/widgets/elementor/container';
import { getWidgetTypeFromFigmaNode } from '@/config/widgetsConfig';

/**
 * Create an Elementor widget from a Figma node
 */
export function createWidgetFromFigmaNode(
	figmaNode: FigmaNode,
	depth: number = 0
): WidgetBase | null {
	// Determine widget type
	const widgetType = getWidgetTypeFromFigmaNode(figmaNode.type);

	if (!widgetType || !isValidWidgetType(widgetType)) {
		console.warn(`Unknown widget type for Figma node: ${figmaNode.type}`);
		return null;
	}

	// Get the mapper
	const figmaMapper = getFigmaMapper(widgetType);
	// console.log("🚀 ~ createWidgetFromFigmaNode ~ figmaMapper:", figmaMapper)
	const mappedSettings = figmaMapper ? figmaMapper(figmaNode) : {};
	console.log('Mapped settings:', mappedSettings);

	// Create widget based on type
	let widget: WidgetBase | null = null;

	switch (widgetType) {
		case 'heading': {
			// For heading widgets, extract text
			const text = figmaNode.characters || 'Heading';
			widget = createHeadingWidget(text, mappedSettings, depth);
			break;
		}

		case 'image': {
			// For image widgets, extract image URL
			let imageUrl = '';
			if (figmaNode.fills && figmaNode.fills[0]?.type === 'IMAGE') {
				imageUrl = figmaNode.fills[0].imageRef || '';
			}
			widget = createImageWidget(imageUrl, mappedSettings, depth);
			break;
		}

		case 'container': {
			// For containers, create empty container (children added later)
			widget = createContainerWidget(mappedSettings, depth);
			break;
		}

		default:
			console.warn(`Unsupported widget type: ${widgetType}`);
			return null;
	}

	return widget;
}

/**
 * Check if Figma node has image fill
 */
export function hasImageFill(figmaNode: FigmaNode): boolean {
	return !!(
		figmaNode.fills &&
		figmaNode.fills.some((fill: any) => fill.type === 'IMAGE')
	);
}

/**
 * Extract image URL from Figma node
 */
export function extractImageUrl(figmaNode: FigmaNode): string {
	if (figmaNode.fills) {
		const imageFill = figmaNode.fills.find(
			(fill: any) => fill.type === 'IMAGE'
		);
		if (imageFill && (imageFill as any).imageRef) {
			return (imageFill as any).imageRef;
		}
	}
	return '';
}
