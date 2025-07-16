'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import template from '@/utils/template';
import Image from 'next/image';
import { runAI } from '@/actions/ai';

// --- Imports for Tiptap Editor ---
import dynamic from 'next/dynamic';
import { TiptapEditorRef } from '@/components/tiptap-editor';
import toast from 'react-hot-toast';
import { saveQuery } from '@/actions/ai';
import { useUser } from '@clerk/nextjs';
import { Template } from '@/utils/types';
import { useUsage } from '@/context/usage';
// --- End Imports for Tiptap Editor ---

// --- Imports for Markdown Handling ---
// ReactMarkdown and remarkGfm can still be used if you want to display Markdown elsewhere on the page,
// but TurndownService is no longer needed directly in page.tsx for editor conversion.
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import TurndownService from 'turndown'; // No longer needed here
// --- End Imports for Markdown Handling ---

// ---

interface TemplatePageProps {
	params: {
		slug: string;
	};
} // --- End interfaces/types ---

// Initialize TurndownService is no longer needed here as it's handled within TiptapEditor.

const TiptapEditor = dynamic(
	() => import('@/components/tiptap-editor').then((mod) => mod.default),
	{
		ssr: false,
		loading: () => <p className="text-center py-4">Loading editor...</p>,
	}
);

export default function Page({ params: initialParams }: TemplatePageProps) {
	const resolvedParams = React.use(initialParams) as { slug: string };
	const { slug } = resolvedParams;

	const editorRef = useRef<TiptapEditorRef>(null);

	const [prompt, setPrompt] = useState('');
	const [generatedContentMarkdown, setGeneratedContentMarkdown] =
		useState('');

	const [loading, setLoading] = useState(false);
	const { count } = useUsage();
	const { user } = useUser();
	const email = user?.primaryEmailAddress?.emailAddress || ''; // No longer needed: const [editorContentAsMarkdown, setEditorContentAsMarkdown] = useState('');

	const t = template.find((item) => item.slug === slug) as Template;

	// This useEffect is now simpler, just feeding the AI response to the editor
	useEffect(() => {
		if (editorRef.current && generatedContentMarkdown) {
			editorRef.current.setMarkdown(generatedContentMarkdown); // Use setMarkdown
		}
	}, [generatedContentMarkdown]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response: string = (await runAI(t.aiPrompt + prompt)) || '';
			setGeneratedContentMarkdown(response);

			await saveQuery(t, email, prompt, response);

			// Now, the TiptapEditor's internal logic will handle updating the editor content
			// based on the `initialContentMarkdown` prop.
			// The `editorRef.current.setMarkdown(response)` in the useEffect above will ensure this.
		} catch (error) {
			console.error('Error generating content:', error);
			setGeneratedContentMarkdown('An error occurred. Please try again.');
			toast.error('Failed to generate content. Please try again.'); // Add error toast
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setPrompt(e.target.value);
	};

	// This function is no longer strictly necessary to convert to markdown,
	// as the TiptapEditor now handles markdown conversion internally for its tabs.
	// You can keep it if you need to manually get the markdown for some other purpose.
	const handleCopyMarkdownToClipboard = () => {
		if (editorRef.current) {
			const markdownContent = editorRef.current.getMarkdown();
			navigator.clipboard
				.writeText(markdownContent)
				.then(() => {
					toast.success('Content copied to clipboard!'); // Success toast
				})
				.catch((err) => {
					console.error('Failed to copy text: ', err);
					toast.error('Failed to copy content to clipboard.'); // Error toast
				});
		} else {
			toast.error('Editor not ready yet.'); // Inform user if editorRef is null
		}
	};

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
		<div className="mr-4">
			<div className="flex justify-between mt-5 mb-0">
				<Link href="/dashboard">
					<Button>
						<ArrowLeft /> <span className="ml-2">Back</span>
					</Button>
				</Link>
				<Button onClick={handleCopyMarkdownToClipboard}>
					<Copy /> <span className="ml-2">Copy</span>
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 py-8">
				<div className="col-span-1 bg-slate-100 dark:bg-slate-900 rounded-md border p-5">
					<div className="flex flex-col gap-3 mb-6">
						<Image
							src={t.icon}
							alt={t.name}
							width={50}
							height={50}
						/>
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
										value={prompt}
									/>
								) : (
									<Textarea
										onChange={handleChange}
										name={item.name}
										required={item.required}
										value={prompt}
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
				<div className="col-span-2 bg-slate-100 dark:bg-slate-900 rounded-md border p-5">
					<h2 className="font-medium text-lg mb-4">
						Generated Content (Editable)
					</h2>
					<TiptapEditor
						ref={editorRef}
						initialContentMarkdown={
							generatedContentMarkdown ||
							'Generated content will appear here.'
						}
						// The onContentUpdate prop can still be useful if you want to react to *any* editor change (user or programmatic)
						// For example, to save content automatically or display a word count.
						// However, for simply displaying markdown in page.tsx, it's less critical now.
						// onContentUpdate={(html) => console.log('Editor HTML updated:', html)}
					/>
				</div>
			</div>
		</div>
	);
}
