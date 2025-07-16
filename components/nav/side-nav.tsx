'use client';
import React from 'react';
import {
	LayoutDashboard,
	FileClock,
	WalletCards,
	Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Usage from '@/components/nav/usage';

export default function SideNav() {
	const path = usePathname();
	const menu = [
		{ name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
		{ name: 'History', icon: FileClock, path: '/dashboard/history' },
		{
			name: 'Billing',
			icon: WalletCards,
			path: '/dashboard/billing',
		},
		{ name: 'Settings', icon: Settings, path: '/dashboard/settings' },
	];

	return (
		<div className="flex flex-col h-[100vh] justify-between">
			{/* This div will now take up only the space it needs for the menu items */}
			<div>
				<ul className="flex-1 space-y-2">
					{menu.map((item, index) => {
						return (
							<li
								key={index}
								className={`${
									path === item.path
										? 'bg-primary text-secondary'
										: 'hover:bg-primary hover:text-secondary'
								} flex m-2 mr-2 p-2 rounded-lg cursor-pointer`}
							>
								<Link href={item.path} className="flex">
									<div className="flex gap-4 justify-center items-center md:justify-start w-full">
										<item.icon />
										<span className="ml-2 hidden md:inline">
											{item.name}
										</span>
									</div>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
			{/* The Usage component will be pushed to the bottom by justify-between on the parent */}
			<div className="pb-20 mt-auto min-h-[100px]">
				<Usage />
			</div>
		</div>
	);
}
