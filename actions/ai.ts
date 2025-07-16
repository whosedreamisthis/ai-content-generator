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

export async function getQueries(
	email: string,
	page: number,
	pageSize: number
) {
	try {
		await db();
		const skip = (page - 1) * pageSize;
		const totalQueries = await Query.countDocuments({ email });

		const queries = await Query.find({ email })
			.skip(skip)
			.limit(pageSize)
			.sort({ createdAt: -1 })
			.lean();
		// Manually convert the queries to plain objects
		const plainQueries = queries.map((query) => ({
			_id: (query._id as string).toString(), // Convert ObjectId to string
			template: query.template,
			email: query.email,
			query: query.query,
			content: query.content,
			createdAt: query.createdAt.toISOString(), // Convert Date to ISO string
			updatedAt: query.updatedAt.toISOString(), // Convert Date to ISO string
			__v: query.__v,
		}));
		return {
			queries: plainQueries,
			totalPages: Math.ceil(totalQueries / pageSize),
		};
	} catch (err) {
		return {
			ok: false,
			queries: [],
			totalPages: 0,
		};
	}
}
