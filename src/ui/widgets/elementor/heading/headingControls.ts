import { FontFamily, HeadingWidgetSettings } from '@/types/widget';
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
	if (figmaNode?.text?.characters) {
		settings.ekit_heading_title = figmaNode.text.characters;
	}

	// Default header size
	settings.ekit_heading_title_tag = 'h2';
	settings.ekit_heading_title_typography_typography = 'custom';

	// Map font family
	const fontFamily = figmaNode?.text?.fontName;

	if (fontFamily && fontFamily !== 'mixed') {
		settings.ekit_heading_title_typography_font_family = fontFamily.family;
		settings.ekit_heading_title_typography_font_style = fontFamily.style;
	} else {
		settings.ekit_heading_title_typography_font_family = '';
		settings.ekit_heading_title_typography_font_style = 'regular';
	}

	// Map font size
	if (figmaNode.text?.fontSize) {
		settings.ekit_heading_title_typography_font_size = {
			unit: 'px',
			size: figmaNode.text.fontSize,
			sizes: [],
		};
	} else if (figmaNode.fontSize) {
		settings.ekit_heading_title_typography_font_size = {
			unit: 'px',
			size: figmaNode.fontSize,
			sizes: [],
		};
	}

	// Map font weight
	if (figmaNode.text?.fontWeight) {
		settings.ekit_heading_title_typography_font_weight = String(figmaNode.text.fontWeight);
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
		settings.ekit_heading_title_typography_font_weight = weightMap[textName] || '400';
	}

	// Map text color
	if (figmaNode?.text?.fills && figmaNode?.text?.fills.length > 0) {
		const fill = figmaNode.text.fills[0];
		if (fill.type === 'SOLID' && fill.color) {
			settings.ekit_heading_title_color = rgbToHex(fill.color);
		}
	}

	// Map text alignment
	if (figmaNode.text?.textAlignHorizontal) {
		const alignment = figmaNode.text.textAlignHorizontal.toLowerCase();
		settings.ekit_heading_title_align =
			alignment === 'center'
				? 'center'
				: alignment === 'right'
					? 'right'
					: 'left';
	} else if (figmaNode.textAlignHorizontal) {
		const alignment = figmaNode.textAlignHorizontal.toLowerCase();
		settings.ekit_heading_title_align =
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
		settings.ekit_heading_title_typography_text_transform = caseMap[figmaNode.text.textCase] || 'none';
	} else if (figmaNode.textCase) {
		const caseMap: Record<string, string> = {
			UPPER: 'uppercase',
			LOWER: 'lowercase',
			TITLE: 'capitalize',
			ORIGINAL: 'none',
		};
		settings.ekit_heading_title_typography_text_transform = caseMap[figmaNode.textCase] || 'none';
	} else {
		settings.ekit_heading_title_typography_text_transform = 'none';
	}

	// Map line height
	if (figmaNode.text?.lineHeightPx) {
		settings.ekit_heading_title_typography_line_height = {
			unit: 'px',
			size: figmaNode.text.lineHeightPx,
			sizes: [],
		};
	} else if (figmaNode.lineHeight && typeof figmaNode.lineHeight === 'object') {
		if (figmaNode.lineHeight.unit === 'PIXELS') {
			settings.ekit_heading_title_typography_line_height = {
				unit: 'px',
				size: figmaNode.lineHeight.value,
				sizes: [],
			};
		}
	}

	// Map letter spacing
	if (figmaNode.text?.letterSpacing) {
		settings.ekit_heading_title_typography_letter_spacing = {
			unit: 'px',
			size: figmaNode.text.letterSpacing,
			sizes: [],
		};
	} else if (figmaNode.letterSpacing) {
		settings.ekit_heading_title_typography_letter_spacing = {
			unit: 'px',
			size: figmaNode.letterSpacing,
			sizes: [],
		};
	}

	// Map text decoration
	if (figmaNode.text?.textDecoration) {
		const decoration = figmaNode.text.textDecoration.toLowerCase();
		settings.ekit_heading_title_typography_text_decoration = decoration === 'none' ? 'none' : decoration;
	} else if (figmaNode.textDecoration) {
		const decoration = figmaNode.textDecoration.toLowerCase();
		settings.ekit_heading_title_typography_text_decoration = decoration === 'none' ? 'none' : decoration;
	} else {
		settings.ekit_heading_title_typography_text_decoration = 'none';
	}

	// Map font text (italic)
	if (figmaNode.fontName?.text) {
		const isItalic = figmaNode.fontName.text.toLowerCase().includes('italic');
		settings.ekit_heading_title_typography_font_text = isItalic ? 'italic' : 'normal';
	} else {
		settings.ekit_heading_title_typography_font_text = 'normal';
	}

	return settings;
}
