'use server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// import Image from 'next/image';

export async function runAI() {
	const response = await ai.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: 'write a 200 word blog post about meditation',
	});

	return response.text;
}
