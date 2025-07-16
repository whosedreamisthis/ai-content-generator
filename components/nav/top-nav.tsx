'use client';
import React from 'react';
import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
	useUser,
} from '@clerk/nextjs';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Toaster } from 'react-hot-toast';
import { Bot } from 'lucide-react';
export default function TopNav() {
	const { isSignedIn, user } = useUser();
	return (
		<nav
			className="flex gap-x-14 flex-row justify-between items-center p-2 shadow"
			style={{ width: '100vw' }}
		>
			<Toaster />
			<Link href="/">
				<Bot />
			</Link>

			<div className="flex items-center gap-3">
				{isSignedIn && (
					<Link href="/dashboard" className="mr-2">
						{`${user.firstName}'s Dashboard`}
					</Link>
				)}
				<SignedOut>
					<SignInButton />
					<SignUpButton>
						<button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
							Sign Up
						</button>
					</SignUpButton>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
				<div className="ml-2">
					<ThemeToggle />
				</div>
			</div>
		</nav>
	);
}
