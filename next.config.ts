import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'plus.unsplash.com', // Keep this if you still use images from Unsplash elsewhere
				port: '',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'cdn-icons-png.flaticon.com', // Add this new hostname
				port: '',
				pathname: '**',
			},
			// Add other domains here if you use more external images
		],
	},
};

export default nextConfig;
