// components/TiptapEditor.tsx
'use client';

import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { marked } from 'marked';
import TurndownService from 'turndown'; // Import TurndownService

// Initialize TurndownService once
const turndownService = new TurndownService();

// Define the shape of the ref that can be passed to this component
export interface TiptapEditorRef {
	getHTML: () => string;
	getJSON: () => Record<string, any>;
	setHTML: (html: string) => void;
	getMarkdown: () => string; // Add getMarkdown method
	setMarkdown: (markdown: string) => void; // Add setMarkdown method
}

interface TiptapEditorProps {
	initialContentMarkdown?: string;
	onContentUpdate?: (html: string) => void;
}

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
	({ initialContentMarkdown = '', onContentUpdate }, ref) => {
		const [activeTab, setActiveTab] = useState<
			'editor' | 'markdown' | 'raw'
		>('editor'); // New state for active tab
		const [rawContent, setRawContent] = useState(''); // New state for raw content

		const initialHtmlForEditor = marked.parse(initialContentMarkdown);

		const editor = useEditor({
			immediatelyRender: false,
			extensions: [StarterKit],
			content: initialHtmlForEditor,
			editorProps: {
				attributes: {
					class: 'prose dark:prose-invert min-h-[150px] p-4 focus:outline-none', // Removed border/rounded classes here
				},
			},
			onUpdate: ({ editor }) => {
				if (onContentUpdate) {
					onContentUpdate(editor.getHTML());
				}
				// Update raw content whenever editor content changes (to keep Markdown/Raw tabs in sync)
				setRawContent(turndownService.turndown(editor.getHTML()));
			},
		});

		useImperativeHandle(ref, () => ({
			getHTML: () => editor?.getHTML() || '',
			getJSON: () => editor?.getJSON() || {},
			setHTML: (html: string) => {
				if (editor) {
					editor.commands.setContent(html); // Removed 'false' to fix cursor/formatting
					setRawContent(turndownService.turndown(html)); // Also update raw content when setting HTML
				}
			},
			getMarkdown: () => {
				return editor ? turndownService.turndown(editor.getHTML()) : '';
			},
			setMarkdown: (markdown: string) => {
				if (editor) {
					const html = marked.parse(markdown);
					editor.commands.setContent(html); // Removed 'false' to fix cursor/formatting
					setRawContent(markdown); // Set raw content directly
				}
			},
		}));

		useEffect(() => {
			if (
				editor &&
				initialContentMarkdown !== null &&
				initialContentMarkdown !== undefined
			) {
				const newHtmlToSet = marked.parse(initialContentMarkdown);
				if (editor.getHTML() !== newHtmlToSet) {
					editor.commands.setContent(newHtmlToSet); // Removed 'false' to fix cursor/formatting
					setRawContent(initialContentMarkdown); // Initialize raw content with the prop
				}
			}
		}, [initialContentMarkdown, editor]);

		// Handle changes in the raw content textarea
		const handleRawContentChange = (
			e: React.ChangeEvent<HTMLTextAreaElement>
		) => {
			setRawContent(e.target.value);
		};

		// Apply raw content to editor when switching back to editor tab
		useEffect(() => {
			if (editor && activeTab === 'editor' && rawContent) {
				const htmlFromRaw = marked.parse(rawContent);
				if (editor.getHTML() !== htmlFromRaw) {
					editor.commands.setContent(htmlFromRaw); // Removed 'false' to fix cursor/formatting
				}
			}
		}, [activeTab, editor, rawContent]);

		const TopMenuBar = () => {
			if (!editor) {
				return null;
			}

			return (
				<div className="flex flex-wrap gap-2 p-2 border-b rounded-t-md bg-gray-50 dark:bg-gray-800">
					<button
						onClick={() =>
							editor.chain().focus().toggleBold().run()
						}
						disabled={
							!editor.can().chain().focus().toggleBold().run()
						}
						className={`p-1 rounded ${
							editor.isActive('bold')
								? 'bg-gray-200 dark:bg-gray-700'
								: ''
						}`}
					>
						Bold
					</button>
					<button
						onClick={() =>
							editor.chain().focus().toggleItalic().run()
						}
						disabled={
							!editor.can().chain().focus().toggleItalic().run()
						}
						className={`p-1 rounded ${
							editor.isActive('italic')
								? 'bg-gray-200 dark:bg-gray-700'
								: ''
						}`}
					>
						Italic
					</button>
					<button
						onClick={() =>
							editor.chain().focus().setParagraph().run()
						}
						className={`p-1 rounded ${
							editor.isActive('paragraph')
								? 'bg-gray-200 dark:bg-gray-700'
								: ''
						}`}
					>
						Paragraph
					</button>
					<button
						onClick={() =>
							editor
								.chain()
								.focus()
								.toggleHeading({ level: 1 })
								.run()
						}
						className={`p-1 rounded ${
							editor.isActive('heading', { level: 1 })
								? 'bg-gray-200 dark:bg-gray-700'
								: ''
						}`}
					>
						H1
					</button>
					<button
						onClick={() =>
							editor
								.chain()
								.focus()
								.toggleHeading({ level: 2 })
								.run()
						}
						disabled={
							!editor
								.can()
								.chain()
								.focus()
								.toggleHeading({ level: 2 })
								.run()
						}
						className={`p-1 rounded ${
							editor.isActive('heading', { level: 2 })
								? 'bg-gray-200 dark:bg-gray-700'
								: ''
						}`}
					>
						H2
					</button>
					<button
						onClick={() =>
							editor.chain().focus().toggleBulletList().run()
						}
						className={`p-1 rounded ${
							editor.isActive('bulletList')
								? 'bg-gray-200 dark:bg-gray-700'
								: ''
						}`}
					>
						Bullet List
					</button>
					<button
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().undo()}
						className="p-1 rounded"
					>
						Undo
					</button>
					<button
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().redo()}
						className="p-1 rounded"
					>
						Redo
					</button>
				</div>
			);
		};

		const BottomTabControls = () => {
			if (!editor) {
				return null;
			}

			return (
				<div className="flex flex-wrap gap-2 p-2 border-t rounded-b-md bg-gray-50 dark:bg-gray-800">
					<button
						onClick={() => setActiveTab('editor')}
						className={`p-1 rounded ${
							activeTab === 'editor'
								? 'bg-gray-200 dark:bg-gray-700'
								: ''
						}`}
					>
						Editor
					</button>
					<button
						onClick={() => {
							setActiveTab('markdown');
							setRawContent(
								turndownService.turndown(editor.getHTML())
							);
						}}
						className={`p-1 rounded ${
							activeTab === 'markdown'
								? 'bg-gray-200 dark:bg-gray-700'
								: ''
						}`}
					>
						Markdown
					</button>
					<button
						onClick={() => {
							setActiveTab('raw');
							setRawContent(editor.getHTML());
						}}
						className={`p-1 rounded ${
							activeTab === 'raw'
								? 'bg-gray-200 dark:bg-gray-700'
								: ''
						}`}
					>
						Raw HTML
					</button>
				</div>
			);
		};

		return (
			<div className="border rounded-md shadow-sm">
				{/* Top Menu Bar with formatting controls */}
				<TopMenuBar />

				{/* Content area */}
				{activeTab === 'editor' && <EditorContent editor={editor} />}
				{(activeTab === 'markdown' || activeTab === 'raw') && (
					<textarea
						className="w-full min-h-[150px] p-4 border-x border-b-0 rounded-t-none rounded-b-none focus:outline-none font-mono text-sm dark:bg-gray-900 dark:text-gray-100"
						value={rawContent}
						onChange={handleRawContentChange}
						placeholder={
							activeTab === 'markdown'
								? 'Markdown content...'
								: 'Raw HTML content...'
						}
					/>
				)}
				{/* Bottom Tab Controls */}
				<BottomTabControls />
			</div>
		);
	}
);

TiptapEditor.displayName = 'TiptapEditor';
export default TiptapEditor;
