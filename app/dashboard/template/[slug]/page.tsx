'use client'; // This directive is essential for client-side functionality

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import template from '@/utils/template'; // Assuming this path is correct for your template data
import Image from 'next/image';
import { runAI } from '@/actions/ai'; // Assuming this path is correct for your AI action

// --- Imports for Tiptap Editor ---
import dynamic from 'next/dynamic';
import { TiptapEditorRef } from '@/components/tiptap-editor'; // Corrected path/casing for your file
// --- End Imports for Tiptap Editor ---

// --- Imports for Markdown Handling ---
import ReactMarkdown from 'react-markdown'; // For displaying Markdown
import remarkGfm from 'remark-gfm'; // Plugin for GitHub Flavored Markdown
import TurndownService from 'turndown'; // For converting HTML back to Markdown
// --- End Imports for Markdown Handling ---

// --- Define your interfaces/types here (ensure these match your actual data structures) ---
export interface Template {
	name: string;
	slug: string;
	icon: string;
	desc: string;
	category: string;
	aiPrompt: string;
	form: Form[];
}

export interface Form {
	label: string;
	field: string;
	name: string;
	required: boolean;
}

interface TemplatePageProps {
	params: {
		slug: string;
	};
}
// --- End interfaces/types ---

// Initialize TurndownService once outside the component
// This ensures it's not recreated on every render, improving performance.
const turndownService = new TurndownService();

// Dynamically import the TiptapEditor component
// `ssr: false` ensures it's only rendered on the client side.
// `.then(mod => mod.default)` is crucial because TiptapEditor is a default export.
const TiptapEditor = dynamic(
	() => import('@/components/tiptap-editor').then((mod) => mod.default),
	{
		ssr: false,
		loading: () => <p className="text-center py-4">Loading editor...</p>,
	}
);

export default function Page({ params: initialParams }: TemplatePageProps) {
	// Accessing params using React.use() for Next.js App Router pattern
	const resolvedParams = React.use(initialParams) as { slug: string };
	const { slug } = resolvedParams;

	// Ref to access methods of the TiptapEditor component
	const editorRef = useRef<TiptapEditorRef>(null);

	// State for form input and AI response
	const [prompt, setPrompt] = useState('');
	const [generatedContentMarkdown, setGeneratedContentMarkdown] =
		useState(''); // Stores AI output as Markdown

	// State for loading indicator
	const [loading, setLoading] = useState(false);

	// New state to hold the Markdown version of the content currently in the editor
	const [editorContentAsMarkdown, setEditorContentAsMarkdown] = useState('');

	// Find the template based on the slug
	const t = template.find((item) => item.slug === slug) as Template;

	// This useEffect ensures the editor's Markdown output is updated
	// when the AI initially generates content.
	useEffect(() => {
		if (editorRef.current && generatedContentMarkdown) {
			// The `onContentUpdate` prop will handle updates after user interaction,
			// but this ensures initial AI content is processed and displayed in markdown state.
			// If the editor is already displaying content, get it and convert to markdown.
			const currentHtml = editorRef.current.getHTML();
			const currentMarkdown = turndownService.turndown(currentHtml);
			setEditorContentAsMarkdown(currentMarkdown);
		}
	}, [generatedContentMarkdown]);

	// Handler for form submission to run AI
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true); // Start loading animation
		try {
			const response: string = await runAI(t.aiPrompt + prompt); // Call your AI action
			setGeneratedContentMarkdown(response); // Store raw AI response (Markdown)

			// IMPORTANT: Update the Tiptap editor with the AI's content (after converting Markdown to HTML)
			if (editorRef.current) {
				const htmlFromAiResponse = turndownService.turndown(response); // Convert AI Markdown to HTML for editor
				editorRef.current.setHTML(htmlFromAiResponse); // Set content in the Tiptap editor
			}

			console.log('AI Response (Markdown):', response);
		} catch (error) {
			console.error('Error generating content:', error);
			setGeneratedContentMarkdown('An error occurred. Please try again.');
			setEditorContentAsMarkdown('An error occurred. Please try again.'); // Update both states on error
		} finally {
			setLoading(false); // Stop loading animation
		}
	};

	// Handler for form input changes
	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setPrompt(e.target.value);
	};

	// Handler to manually get edited content from the Tiptap editor and convert to Markdown
	const handleGetEditedContent = () => {
		if (editorRef.current) {
			const currentHtml = editorRef.current.getHTML();
			const currentMarkdown = turndownService.turndown(currentHtml); // Convert HTML to Markdown
			setEditorContentAsMarkdown(currentMarkdown); // Update the state
			console.log('Current editor content (Markdown):', currentMarkdown);
			alert(
				'Editor content converted to Markdown and logged to console!'
			);
		}
	};

	// Handle case where template is not found (e.g., invalid slug)
	if (!t) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<h1 className="text-2xl font-bold">Template Not Found</h1>
				<Link href="/dashboard">
					<Button className="mt-4">
						<ArrowLeft className="mr-2 h-4 w-4" /> Go Back to
						Dashboard
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-5 py-8">
			{' '}
			{/* Added py-8 for some vertical padding */}
			{/* Left Column: Template Info and Form */}
			<div className="col-span-1 bg-slate-100 dark:bg-slate-900 rounded-md border p-5">
				<div className="flex flex-col gap-3 mb-6">
					<Image src={t.icon} alt={t.name} width={50} height={50} />
					<h2 className="font-medium text-lg">{t.name}</h2>
					<p className="text-gray-500 text-sm">{t.desc}</p>
				</div>
				<form className="mt-6" onSubmit={handleSubmit}>
					{t.form.map((item) => (
						<div
							key={item.name}
							className="my-2 flex flex-col gap-2 mb-7"
						>
							<label className="font-bold text-sm pb-1">
								{item.label}
							</label>
							{item.field === 'input' ? (
								<Input
									onChange={handleChange}
									name={item.name}
									required={item.required}
									value={prompt} // Controlled component
								/>
							) : (
								<Textarea
									onChange={handleChange}
									name={item.name}
									required={item.required}
									value={prompt} // Controlled component
								/>
							)}
						</div>
					))}
					<Button
						type="submit"
						className="w-full py-6 mt-4"
						disabled={loading}
					>
						{loading ? (
							<Loader2Icon className="animate-spin mr-2" />
						) : (
							'Generate content'
						)}
					</Button>
				</form>
			</div>
			{/* Right Column: Tiptap Editor and Markdown Preview */}
			<div className="col-span-2 bg-slate-100 dark:bg-slate-900 rounded-md border p-5">
				<h2 className="font-medium text-lg mb-4">
					Generated Content (Editable)
				</h2>
				<TiptapEditor
					ref={editorRef}
					initialContentMarkdown={
						generatedContentMarkdown ||
						'<p>Generated content will appear here.</p>'
					}
					// This callback updates the `editorContentAsMarkdown` state whenever the editor's HTML changes
					onContentUpdate={(html) =>
						setEditorContentAsMarkdown(
							turndownService.turndown(html)
						)
					}
				/>

				{/* Button to manually trigger markdown conversion and display */}
				<Button
					onClick={() => {
						navigator.clipboard.writeText(editorContentAsMarkdown);
					}}
					className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
				>
					Copy Markdown to Clipboard
				</Button>
			</div>
		</div>
	);
}
