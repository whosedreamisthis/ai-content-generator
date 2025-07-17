'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Divide } from 'lucide-react';
export default function PlanCard({
	name,
	image,
}: {
	name: string;
	image: string;
}) {
	const { isSignedIn, isLoaded } = useUser();

	const handleCheckout = async () => {};
	return (
		<div className="max-w-sm rounded overflow-hidden shadow-lg m-4 border">
			<Image
				width={100}
				height={100}
				className="m-5 text-white"
				src={image}
				alt={name}
			/>
			<div className="px-6 py-4">
				<div className="font-bold text-el mb-2">{`${name} Membership`}</div>
				<p className="text-gray-700 dark:text-gray-300">
					{name == 'Free'
						? 'Enjoy limited AI-generated content forever for just $0.00'
						: 'Enjoy unlimited AI-generated content forever for just $9.99/month'}
				</p>
				<ul className="mt-5">
					<li>
						🔥 {name == 'Free' ? 'Limited' : 'Unlimited'} word
						generation
					</li>
					<li>
						🔥 {name == 'Free' ? 'Customer' : 'Priority customer'}{' '}
						support
					</li>
					<li>🔥 {name == 'Free' ? 'Ads' : 'No ads'} </li>
				</ul>
			</div>
			{!isLoaded ? (
				''
			) : !isSignedIn ? (
				<div className="px-5pb-10">
					<Button>
						<SignInButton />
					</Button>
				</div>
			) : (
				<div className="px-5 pb-10">
					<Button onClick={handleCheckout}>Get Started</Button>
				</div>
			)}
		</div>
	);
}
