import React from 'react';
import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
export default function TopNav() {
	return (
		<nav
			className="flex gap-x-14 flex-row justify-between items-center p-2 shadow"
			style={{ width: '100vw' }}
		>
			<Link href="/">AI</Link>
			<div>
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
			</div>
		</nav>
	);
}
