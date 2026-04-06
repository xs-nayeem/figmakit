import { HeadingWidgetSettings } from '@/types/widget';
import { rgbToHex } from '@/ui/utils/rgbToHex';

/**
 * Default settings and controls for Heading widget
 * Based on Elementor heading widget structure
 */
export const defaultHeadingSettings: HeadingWidgetSettings = {
	title: 'Heading Text',
	header_size: 'h2',
	align: 'left',
	typography_typography: 'custom',
	typography_font_family: 'Inter',
	typography_font_size: {
		unit: 'px',
		size: 24,
		sizes: [],
	},
	typography_font_weight: '400',
	typography_text_transform: 'none',
	typography_font_text: 'normal',
	typography_text_decoration: 'none',
	typography_line_height: {
		unit: 'em',
		size: 1.2,
		sizes: [],
	},
	typography_letter_spacing: {
		unit: 'px',
		size: 0,
		sizes: [],
	},
	typography_word_spacing: {
		unit: 'px',
		size: 0,
		sizes: [],
	},
	title_color: '#000000',
	title_hover_color: '#0066FF',
	blend_mode: 'normal',
};

/**
 * Map Figma text node to Elementor heading settings
 * Extracts ALL text properties dynamically from Figma
 */
export function mapFigmaTextToHeading(
	figmaNode: any
): Partial<HeadingWidgetSettings> {
	const settings: Partial<HeadingWidgetSettings> = {};

	// Map text content
	if (figmaNode.characters) {
		settings.title = figmaNode.characters;
	}

	// Default header size
	settings.header_size = 'h2';
	settings.typography_typography = 'custom';

	// Map font family
	if (figmaNode.text?.fontFamily) {
		settings.typography_font_family = figmaNode.text.fontFamily;
	} else if (figmaNode.fontName?.family) {
		settings.typography_font_family = figmaNode.fontName.family;
	}

	// Map font size
	if (figmaNode.text?.fontSize) {
		settings.typography_font_size = {
			unit: 'px',
			size: figmaNode.text.fontSize,
			sizes: [],
		};
	} else if (figmaNode.fontSize) {
		settings.typography_font_size = {
			unit: 'px',
			size: figmaNode.fontSize,
			sizes: [],
		};
	}

	// Map font weight
	if (figmaNode.text?.fontWeight) {
		settings.typography_font_weight = String(figmaNode.text.fontWeight);
	} else if (figmaNode.fontName?.text) {
		// Extract weight from text name (e.g., "Regular" = 400, "Bold" = 700)
		const textName = figmaNode.fontName.text.toLowerCase();
		const weightMap: Record<string, string> = {
			thin: '100',
			extralight: '200',
			light: '300',
			regular: '400',
			medium: '500',
			semibold: '600',
			bold: '700',
			extrabold: '800',
			black: '900',
		};
		settings.typography_font_weight = weightMap[textName] || '400';
	}

	// Map text color
	if (figmaNode.fills && figmaNode.fills.length > 0) {
		const fill = figmaNode.fills[0];
		if (fill.type === 'SOLID' && fill.color) {
			settings.title_color = rgbToHex(fill.color);
		}
	}

	// Map text alignment
	if (figmaNode.text?.textAlignHorizontal) {
		const alignment = figmaNode.text.textAlignHorizontal.toLowerCase();
		settings.align =
			alignment === 'center'
				? 'center'
				: alignment === 'right'
					? 'right'
					: 'left';
	} else if (figmaNode.textAlignHorizontal) {
		const alignment = figmaNode.textAlignHorizontal.toLowerCase();
		settings.align =
			alignment === 'center'
				? 'center'
				: alignment === 'right'
					? 'right'
						: 'left';
	}

	// Map text transform
	if (figmaNode.text?.textCase) {
		const caseMap: Record<string, string> = {
			UPPER: 'uppercase',
			LOWER: 'lowercase',
			TITLE: 'capitalize',
			ORIGINAL: 'none',
		};
		settings.typography_text_transform = caseMap[figmaNode.text.textCase] || 'none';
	} else if (figmaNode.textCase) {
		const caseMap: Record<string, string> = {
			UPPER: 'uppercase',
			LOWER: 'lowercase',
			TITLE: 'capitalize',
			ORIGINAL: 'none',
		};
		settings.typography_text_transform = caseMap[figmaNode.textCase] || 'none';
	} else {
		settings.typography_text_transform = 'none';
	}

	// Map line height
	if (figmaNode.text?.lineHeightPx) {
		settings.typography_line_height = {
			unit: 'px',
			size: figmaNode.text.lineHeightPx,
			sizes: [],
		};
	} else if (figmaNode.lineHeight && typeof figmaNode.lineHeight === 'object') {
		if (figmaNode.lineHeight.unit === 'PIXELS') {
			settings.typography_line_height = {
				unit: 'px',
				size: figmaNode.lineHeight.value,
				sizes: [],
			};
		}
	}

	// Map letter spacing
	if (figmaNode.text?.letterSpacing) {
		settings.typography_letter_spacing = {
			unit: 'px',
			size: figmaNode.text.letterSpacing,
			sizes: [],
		};
	} else if (figmaNode.letterSpacing) {
		settings.typography_letter_spacing = {
			unit: 'px',
			size: figmaNode.letterSpacing,
			sizes: [],
		};
	}

	// Map text decoration
	if (figmaNode.text?.textDecoration) {
		const decoration = figmaNode.text.textDecoration.toLowerCase();
		settings.typography_text_decoration = decoration === 'none' ? 'none' : decoration;
	} else if (figmaNode.textDecoration) {
		const decoration = figmaNode.textDecoration.toLowerCase();
		settings.typography_text_decoration = decoration === 'none' ? 'none' : decoration;
	} else {
		settings.typography_text_decoration = 'none';
	}

	// Map font text (italic)
	if (figmaNode.fontName?.text) {
		const isItalic = figmaNode.fontName.text.toLowerCase().includes('italic');
		settings.typography_font_text = isItalic ? 'italic' : 'normal';
	} else {
		settings.typography_font_text = 'normal';
	}

	return settings;
}
