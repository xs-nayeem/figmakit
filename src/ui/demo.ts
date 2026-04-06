/**
 * FigmaKit Usage Demo
 * Demonstrates how to use the FigmaKit conversion system
 */

import { FigmaNode } from '@/types/elementor';
import { buildAndExportElementorPage } from '@/builder/pageBuilder';
import { convertFigmaToElementor } from '@/builder/elementorBuilder';
import { createHeadingWidget } from '@/widgets/elementor/heading';
import { createImageWidget } from '@/widgets/elementor/image';
import { createContainerWidget } from '@/widgets/elementor/container';

// ============================================
// Example 1: Simple Text to Heading Widget
// ============================================

export function example1_SimpleHeading() {
	const heading = createHeadingWidget('Welcome to FigmaKit', {
		typography_font_size: { unit: 'px', size: 48, sizes: [] },
		title_color: '#1a1a1a',
		header_size: 'h1',
	});

	return heading;
}

// ============================================
// Example 2: Image Widget
// ============================================

export function example2_ImageWidget() {
	const image = createImageWidget('https://example.com/hero.jpg', {
		width: { unit: 'px', size: 1200, sizes: [] },
		height: { unit: 'px', size: 600, sizes: [] },
		object_fit: 'cover',
	});

	console.log('Example 2: Image Widget');
	console.log(JSON.stringify(image, null, 2));
	return image;
}

// ============================================
// Example 3: Container with Children
// ============================================

export function example3_ContainerWithChildren() {
	const container = createContainerWidget({
		flex_direction: 'column',
		flex_gap: {
			size: 20,
			column: '20',
			row: '20',
			unit: 'px',
			isLinked: true,
		},
		padding: {
			unit: 'px',
			top: '40',
			right: '40',
			bottom: '40',
			left: '40',
			isLinked: false,
		},
		background_color: '#f5f5f5',
	});

	// Add children
	container.elements.push(
		createHeadingWidget('Section Title', {
			typography_font_size: { unit: 'px', size: 36, sizes: [] },
		}),
		createHeadingWidget('Section description goes here', {
			typography_font_size: { unit: 'px', size: 18, sizes: [] },
			title_color: '#666666',
		})
	);

	return container;
}

// ============================================
// Example 4: Convert Figma Node to Elementor
// ============================================

export function example4_FigmaToElementor() {
	const figmaNode: FigmaNode = {
		id: 'figma-frame-1',
		type: 'FRAME',
		name: 'Card',
		layoutMode: 'VERTICAL',
		itemSpacing: 16,
		paddingTop: 24,
		paddingRight: 24,
		paddingBottom: 24,
		paddingLeft: 24,
		fills: [
			{
				type: 'SOLID',
				color: { r: 1, g: 1, b: 1 },
			},
		],
		cornerRadius: 12,
		children: [
			{
				id: 'text-1',
				type: 'TEXT',
				characters: 'Card Title',
				style: {
					fontSize: 24,
					fontFamily: 'Inter',
					fontWeight: 600,
				},
				fills: [
					{
						type: 'SOLID',
						color: { r: 0.1, g: 0.1, b: 0.1 },
					},
				],
			},
			{
				id: 'text-2',
				type: 'TEXT',
				characters: 'Card description text',
				style: {
					fontSize: 16,
					fontFamily: 'Inter',
					fontWeight: 400,
				},
				fills: [
					{
						type: 'SOLID',
						color: { r: 0.5, g: 0.5, b: 0.5 },
					},
				],
			},
		],
	};

	const elementorElement = convertFigmaToElementor(figmaNode);
	console.log('Example 4: Figma to Elementor Conversion');
	console.log(JSON.stringify(elementorElement, null, 2));
	return elementorElement;
}

// ============================================
// Example 5: Complete Page Export
// ============================================

export function example5_CompletePageExport() {
	const figmaPage: FigmaNode = {
		id: 'page-root',
		type: 'FRAME',
		name: 'Landing Page',
		layoutMode: 'VERTICAL',
		itemSpacing: 40,
		paddingTop: 0,
		paddingRight: 0,
		paddingBottom: 0,
		paddingLeft: 0,
		children: [
			// Header
			{
				id: 'header',
				type: 'FRAME',
				name: 'Header',
				layoutMode: 'HORIZONTAL',
				primaryAxisAlignItems: 'SPACE_BETWEEN',
				itemSpacing: 20,
				paddingTop: 20,
				paddingRight: 40,
				paddingBottom: 20,
				paddingLeft: 40,
				children: [
					{
						id: 'logo',
						type: 'TEXT',
						characters: 'MyBrand',
						style: {
							fontSize: 28,
							fontFamily: 'Inter',
							fontWeight: 700,
						},
					},
				],
			},
			// Hero
			{
				id: 'hero',
				type: 'FRAME',
				name: 'Hero',
				layoutMode: 'VERTICAL',
				primaryAxisAlignItems: 'CENTER',
				itemSpacing: 24,
				paddingTop: 80,
				paddingRight: 40,
				paddingBottom: 80,
				paddingLeft: 40,
				children: [
					{
						id: 'hero-title',
						type: 'TEXT',
						characters: 'Transform Your Designs',
						style: {
							fontSize: 56,
							fontFamily: 'Inter',
							fontWeight: 700,
							textAlignHorizontal: 'CENTER',
						},
					},
					{
						id: 'hero-subtitle',
						type: 'TEXT',
						characters: 'From Figma to WordPress in seconds',
						style: {
							fontSize: 24,
							fontFamily: 'Inter',
							fontWeight: 400,
							textAlignHorizontal: 'CENTER',
						},
					},
				],
			},
		],
	};

	const elementorJSON = buildAndExportElementorPage(
		figmaPage,
		'My Landing Page'
	);
	console.log('Example 5: Complete Page Export');
	console.log(elementorJSON);
	return elementorJSON;
}

// ============================================
// Run All Examples
// ============================================

export function runAllExamples() {
	console.log('\n========================================');
	console.log('FigmaKit Conversion Examples');
	console.log('========================================\n');

	example1_SimpleHeading();
	console.log('\n---\n');

	example2_ImageWidget();
	console.log('\n---\n');

	example3_ContainerWithChildren();
	console.log('\n---\n');

	example4_FigmaToElementor();
	console.log('\n---\n');

	example5_CompletePageExport();
	console.log('\n========================================\n');
}

// Auto-run if executed directly
if (typeof window === 'undefined') {
	runAllExamples();
}
