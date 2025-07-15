'use client';
import { useState, useEffect } from 'react';
import { runAI } from '@/actions/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
export default function Home() {
	const [response, setResponse] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [prompt, setPrompt] = useState('');

	const handleClick = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		try {
			const data: any = await runAI(prompt);
			setResponse(data); // Set the response from the AI call
		} catch (err) {
			console.error('Error calling Server Action:', err); // Use console.error for errors
			setResponse(
				`Error: ${err instanceof Error ? err.message : String(err)}`
			); // Display specific error
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<form className="m-10" onSubmit={handleClick}>
				<Input
					type="text"
					value={prompt}
					placeholder="Ask AI something."
					onChange={(e) => setPrompt(e.target.value)}
				/>
				<Button
					className="mt-10 p-4"
					variant="default"
					size="sm"
					type="submit"
					disabled={loading}
				>
					Ask AI
				</Button>
			</form>
			<Card className="m-10">
				<CardHeader>
					<CardTitle>AI Response</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div>Loading...</div>
					) : (
						<ReactMarkdown>{response}</ReactMarkdown>
					)}
				</CardContent>
			</Card>
		</>
	);
}
