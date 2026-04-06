// Figma node structure
export type FigmaNode = {
	id: string;
	type: string;
	name?: string;
	characters?: string;
	text?:{
		characters?: string;
		fontSize?: number;
		fontWeight?: number;
	};
	style?: {
		fontSize?: number;
		fontFamily?: string;
		fontWeight?: number;
		textAlignHorizontal?: string;
	};
	fills?: Array<{
		type: string;
		color?: any;
		imageRef?: string;
		scaleMode?: string;
	}>;
	absoluteBoundingBox?: { width?: number; height?: number };
	cornerRadius?: number;
	paddingTop?: number;
	paddingRight?: number;
	paddingBottom?: number;
	paddingLeft?: number;
	layoutMode?: string;
	primaryAxisAlignItems?: string;
	counterAxisAlignItems?: string;
	itemSpacing?: number;
	children?: FigmaNode[];
};

// Elementor widget structure
export type ElementorWidget = {
	id: string;
	settings: Record<string, any>;
	elements?: ElementorWidget[];
	isInner?: boolean;
	widgetType?: string;
	elType: 'widget' | 'container';
};

// Elementor page structure
export type ElementorPage = {
	content: ElementorWidget[];
	page_settings: Record<string, any>;
	version: string;
	title: string;
	type: string;
};
