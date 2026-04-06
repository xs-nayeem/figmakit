import { useState, useEffect } from 'react';
import type { ElementorPage, FigmaNode } from '@/types/elementor';
import { buildElementorPage } from '@/builder/pageBuilder';
import { createHeadingWidget } from '../widgets/elementor';

export default function FigmaToElementor() {
	const [elementorData, setElementorData] = useState<ElementorPage | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [copied, setCopied] = useState(false);

	// Copy JSON to clipboard
	const handleCopyJSON = async () => {
		if (!elementorData) return;

		try {
			const jsonString = JSON.stringify(elementorData, null, 2);

			// Try modern clipboard API first
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(jsonString);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} else {
				// Fallback: Create a temporary textarea and copy
				const textarea = document.createElement('textarea');
				textarea.value = jsonString;
				textarea.style.position = 'fixed';
				textarea.style.opacity = '0';
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}
		} catch (err) {
			console.error('Failed to copy:', err);
			setError(
				'Could not copy to clipboard. Please select and copy manually.'
			);
		}
	};

	// Request data from the plugin context (no API key needed!)
	const handleFetchFromPlugin = () => {
		setLoading(true);
		setError('');

		// Ask the plugin code to send us the current file's nodes
		parent.postMessage(
			{
				pluginMessage: { type: 'get-figma-nodes' },
			},
			'*'
		);
	};

	// Listen for messages from the plugin
	useEffect(() => {
		window.onmessage = (event) => {
			const msg = event.data.pluginMessage;

			if (msg?.type === 'figma-nodes-data') {
				try {
					// Convert Figma nodes to Elementor page
					const figmaNodes = msg.nodes as FigmaNode[];
					console.log("🚀 ~ FigmaToElementor ~ figmaNodes:", figmaNodes)
					const elementorPagef = parseFigmaNodesToElementorPage(figmaNodes);
					console.log("🚀 ~ FigmaToElementor ~ elementorPage:", elementorPagef)
					// setElementorData(elementorPage);

					// buildElementorPage handles both single and multiple nodes
					const elementorPage = buildElementorPage(
						figmaNodes.length === 1 ? figmaNodes[0] : figmaNodes,
						'FigmaKit PageX'
					);

					setElementorData(elementorPage);
					setLoading(false);
				} catch (err) {
					console.error('Error parsing Figma nodes:', err);
					setError(
						err instanceof Error
							? err.message
							: 'Failed to parse nodes'
					);
					setLoading(false);
				}
			}

			if (msg?.type === 'error') {
				setError(msg.message);
				setLoading(false);
			}
		};
	}, []);
	const parseFigmaNodesToElementorPage = (figmaNodes: FigmaNode[]) => {
		// Implementation for parsing Figma nodes to Elementor page
		// console.log("🚀 ~ parseFigmaNodesToElementorPage ~ figmaNodes:", figmaNodes)
		figmaNodes && Array.isArray(figmaNodes) && figmaNodes.length > 0 &&
		figmaNodes.map(node => {
			if(node?.type === 'TEXT'){
				const text = node.text?.characters || 'Heading';
				let headingWidget = createHeadingWidget(text, {}, 0);
				return {

				}
			}
			if(node?.type === 'FRAME' || node?.type === 'GROUP') {
				const childs = parseFigmaNodesToElementorPage(node?.children || []);
			}
		}).filter(Boolean);
	};

	return (
		<div style={{ padding: '20px' }}>
			<h2>Elementor `_element_data` Preview</h2>

			<div style={{ marginBottom: '20px' }}>
				<button
					onClick={handleFetchFromPlugin}
					disabled={loading}
					style={{
						padding: '10px 20px',
						cursor: loading ? 'not-allowed' : 'pointer',
						fontSize: '14px',
						backgroundColor: '#0066ff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
					}}
				>
					{loading
						? 'Loading...'
						: 'Convert Selected Nodes to Elementor'}
				</button>

				<div
					style={{
						marginTop: '10px',
						fontSize: '12px',
						color: '#666',
					}}
				>
					✨ No API key needed - converts the currently selected
					nodes.
				</div>
			</div>

			{error && (
				<div
					style={{
						padding: '10px',
						backgroundColor: '#fee',
						border: '1px solid #c00',
						borderRadius: '4px',
						marginBottom: '20px',
					}}
				>
					<strong>Error:</strong> {error}
				</div>
			)}

			{loading && <p>Loading...</p>}

			{elementorData && (
				<>
					<div style={{ marginBottom: '15px' }}>
						<button
							onClick={handleCopyJSON}
							style={{
								padding: '8px 16px',
								cursor: 'pointer',
								fontSize: '13px',
								backgroundColor: copied ? '#6c757d' : '#007bff',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							{copied ? '✓ Copied!' : '📋 Copy JSON'}
						</button>
					</div>

					<pre
						style={{
							backgroundColor: '#f5f5f5',
							padding: '15px',
							borderRadius: '4px',
							overflow: 'auto',
							maxHeight: '500px',
						}}
					>
						{JSON.stringify(elementorData, null, 2)}
					</pre>
				</>
			)}
		</div>
	);
}
