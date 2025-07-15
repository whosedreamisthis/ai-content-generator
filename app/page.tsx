'use client';
import { useState } from 'react';
import { runAI } from '@/actions/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export default function Home() {
	const [response, setResponse] = useState<string>('first');
	const [loading, setLoading] = useState(false);
	const [prompt, setPrompt] = useState('');
	const handleClick = async () => {
		console.log('handleClick');
		setLoading(true);
		try {
			const data: any = await runAI(prompt);
			console.log('data', data);
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
			{/* Display the response state, not a direct call to runAI */}
			<Input
				className="m-5"
				type="text"
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
			/>
			<Button
				className="m-5 p-4"
				variant="default"
				size="sm"
				onClick={handleClick}
				disabled={loading}
			>
				Ask AI
			</Button>
			<div>{loading ? 'Loading...' : response}</div>
		</>
	);
}
