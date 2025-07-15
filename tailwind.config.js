// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/**/*.{js,ts,jsx,tsx,mdx}', // Include if you have a 'src' directory
		// Add any other paths where you use Tailwind classes, e.g., for Shadcn components:
		// './node_modules/shadcn-ui/**/*.{js,ts,jsx,tsx}', // Or the path where your Shadcn components are generated
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
