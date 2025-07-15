'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import template from '@/utils/template';
import Image from 'next/image';
import { runAI } from '@/actions/ai';
import ReactMarkdown from 'react-markdown';

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
export default function Page({ params: initialParams }: any) {
	// Use React.use() directly on the params object.
	// Next.js sets up `params` so it's compatible with React.use() in this context.
	const resolvedParams = React.use(initialParams) as { slug: string };
	const { slug } = resolvedParams;

	const [prompt, setPrompt] = React.useState('');
	const [content, setContent] = React.useState('');
	const [loading, setLoading] = React.useState(false);

	const t = template.find((item) => item.slug === slug) as Template;
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response: any = await runAI(t.aiPrompt + prompt);
			setContent(response);
			console.log(response);
		} catch (error) {
			setContent('An error occured. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		e.preventDefault();
		setPrompt(e.target.value);
	};
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-5">
			<div className="col-span-1 bg-slate-100 dark:bg-slate-900 rounded-md border p-5">
				<div className="flex flex-col gap-3">
					<Image src={t.icon} alt={t.name} width={50} height={50} />
					<h2 className="font-medium text-lg">{t.name}</h2>
					<p className="text-gray-500">{t.desc}</p>
				</div>
				<form className="mt-6" onSubmit={handleSubmit}>
					{t.form.map((item) => (
						<div
							key={item.name}
							className="my-2 flex flex-col gap-2 mb-7"
						>
							<label className="font-bold pb-5">
								{item.label}
							</label>
							{item.field === 'input' ? (
								<Input
									onChange={handleChange}
									name={item.name}
									required={item.required}
								/>
							) : (
								<Textarea
									onChange={handleChange}
									name={item.name}
									required={item.required}
								/>
							)}
						</div>
					))}
					<Button
						type="submit"
						className="w-full py-6"
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
			{/* <ReactMarkdown> */}
			<div className="col-span-2">{content}</div>
			{/* </ReactMarkdown> */}
		</div>
	);
}
