/**
 * Base types for FigmaKit widgets
 */

export interface WidgetBase {
	id: string;
	settings: Record<string, any>;
	elements: WidgetBase[];
	isInner?: boolean;
	widgetType?: string;
	elType: 'widget' | 'container';
}

export interface HeadingWidgetSettings {
	ekit_heading_title?: string;
	ekit_heading_title_tag?: string;
	align?: string;
	ekit_heading_title_typography_typography?: string;
	ekit_heading_title_typography_font_family?: string;
	ekit_heading_title_typography_font_size?: {
		unit: string;
		size: number;
		sizes: any[];
	};
	ekit_heading_title_typography_font_weight?: string;
	ekit_heading_title_text_transform?: string;
	ekit_heading_title_color?: string;
	[key: string]: any;
}

export interface FontFamily {
	family: string;
	style: string;
}

export interface ImageWidgetSettings {
	image?: {
		url: string;
		id: string;
	};
	image_size?: string;
	width?: {
		unit: string;
		size: number;
		sizes: any[];
	};
	height?: {
		unit: string;
		size: number;
		sizes: any[];
	};
	object_fit?: string;
	[key: string]: any;
}

export interface ContainerWidgetSettings {
	content_position?: string;
	flex_direction?: string;
	flex_align_items?: string;
	flex_justify_content?: string;
	flex_gap?: {
		size: number;
		column: string;
		row: string;
		unit: string;
		isLinked: boolean;
	};
	padding?: {
		unit: string;
		top: string;
		right: string;
		bottom: string;
		left: string;
		isLinked: boolean;
	};
	background_background?: string;
	background_color?: string;
	border_radius?: {
		unit: string;
		top: string;
		right: string;
		bottom: string;
		left: string;
		isLinked: boolean;
	};
	[key: string]: any;
}

export type WidgetFactory = (data: any, depth?: number) => WidgetBase;
