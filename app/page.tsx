'use client';
import { useState } from 'react';
import { runAI } from '@/actions/ai';

export default function Home() {
	const [response, setResponse] = useState<string>('first');
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		console.log('handleClick');
		setLoading(true);
		try {
			const data: any = await runAI();
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
			<div>{response}</div>
			<button onClick={handleClick} disabled={loading}>
				{loading ? 'Loading...' : 'Ask AI'}
			</button>
		</>
	);
}
