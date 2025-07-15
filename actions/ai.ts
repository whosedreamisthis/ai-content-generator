'use server';
import { GoogleGenAI } from '@google/genai';
import db from '@/utils/db';
import Query from '@/models/query';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// import Image from 'next/image';

export async function runAI(prompt: string) {
	const response = await ai.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: prompt,
	});

	return response.text;
}

export async function saveQuery(
	template: Object,
	email: string,
	query: string,
	content: string
) {
	console.log('saveQuery');

	try {
		console.log('template', template);
		console.log('email', email);
		console.log('query', query);
		console.log('content', content);

		await db();
		const newQuery = new Query({
			template,
			email,
			query,
			content,
		});

		console.log('saveQuery 2');
		await newQuery.save();
		console.log('saveQuery 3');
		return {
			ok: true,
		};
	} catch (err) {
		console.log(err);
		return {
			ok: false,
		};
	}
}
