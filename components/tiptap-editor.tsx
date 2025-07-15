// components/TiptapEditor.tsx
'use client';

import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { marked } from 'marked'; // Ensure you have 'marked' installed: npm install marked

// Define the shape of the ref that can be passed to this component
export interface TiptapEditorRef {
	getHTML: () => string;
	getJSON: () => Record<string, any>;
	setHTML: (html: string) => void;
}

interface TiptapEditorProps {
	initialContentMarkdown?: string; // This prop now explicitly expects Markdown
	onContentUpdate?: (html: string) => void; // Editor still outputs HTML
}

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
	({ initialContentMarkdown = '', onContentUpdate }, ref) => {
		// IMPORTANT: The `content` prop of useEditor is for initial setup.
		// If you always want to update based on `initialContentMarkdown`,
		// the useEffect below is the primary mechanism.
		// For the initial content, we pass the parsed markdown directly.
		const initialHtmlForEditor = marked.parse(initialContentMarkdown);

		const editor = useEditor({
			immediatelyRender: false, // Essential for Next.js SSR
			extensions: [
				StarterKit,
				// Add your other extensions here, e.g., MapNode
			],
			content: initialHtmlForEditor, // Set initial content on editor creation
			editorProps: {
				attributes: {
					class: 'prose dark:prose-invert min-h-[150px] p-4 border rounded-b-md focus:outline-none',
				},
			},
			onUpdate: ({ editor }) => {
				// This callback fires whenever the editor's content changes (user typing, programmatically, etc.)
				if (onContentUpdate) {
					onContentUpdate(editor.getHTML()); // Pass current HTML content to parent
				}
			},
			// onDestroy: () => {
			//   console.log('Editor destroyed'); // Good for debugging unmounts
			// }
		});

		// Expose methods to the parent component via ref
		useImperativeHandle(ref, () => ({
			getHTML: () => editor?.getHTML() || '',
			getJSON: () => editor?.getJSON() || {},
			setHTML: (html: string) => {
				if (editor) {
					editor.commands.setContent(html, false); // false = don't update selection/history
				}
			},
		}));

		// Effect to update editor content when initialContentMarkdown prop changes from parent.
		// This is crucial for when the AI returns new content.
		useEffect(() => {
			if (
				editor &&
				initialContentMarkdown !== null &&
				initialContentMarkdown !== undefined
			) {
				const newHtmlToSet = marked.parse(initialContentMarkdown);

				// Only update if the content actually needs to change.
				// This prevents unnecessary re-renders or adding to the undo history
				// if the incoming prop is the same as what's already in the editor.
				if (editor.getHTML() !== newHtmlToSet) {
					editor.commands.setContent(newHtmlToSet, false);
					// console.log("Editor content updated via prop change:", newHtmlToSet); // Debugging
				}
			}
		}, [initialContentMarkdown, editor]); // Re-run effect if initialContentMarkdown or editor instance changes

		// Simple Menu Bar (you'll expand this later for more features)
		const MenuBar = () => {
			if (!editor) {
				return null; // Don't render menu bar until editor is initialized
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
						} // Added disabled check
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

		return (
			<div className="border rounded-md shadow-sm">
				<MenuBar />
				<EditorContent editor={editor} />
			</div>
		);
	}
);

TiptapEditor.displayName = 'TiptapEditor';
export default TiptapEditor;
