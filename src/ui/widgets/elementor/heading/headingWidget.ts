import { getUniqueId } from '@/utils/getUniqueId';
import { getIsInner } from '@/utils/getIsInner';
import { WidgetBase, HeadingWidgetSettings } from '@/types/widget';

/**
 * Create a Heading widget for Elementor
 * Uses dynamic settings from Figma text node - no static defaults
 */
export function createHeadingWidget(
	text: string,
	settings: Partial<HeadingWidgetSettings> = {},
	depth: number = 0
): WidgetBase {
	console.log('Creating heading widget with text:', text, 'and settings:', settings);
	return {
		id: getUniqueId(),
		settings: {
			title: text,
			...settings,
		},
		elements: [],
		isInner: getIsInner(depth),
		widgetType: 'heading',
		elType: 'widget',
	};
}
