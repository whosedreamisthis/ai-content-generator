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
		<div className="h-screen p-5 shadow-sm border">
			{menu.map((item, index) => {
				return (
					<div
						key={index}
						className={`${
							path === item.path
								? 'bg-primary text-secondary'
								: 'hover:bg-primary hover:text-secondary'
						} flex m-2 mr-2 p-2  rounded-lg cursor-pointer`}
					>
						<Link href={item.path} className="flex">
							<div className="flex gap-4 justify-center items-center md:justify-start w-full">
								<item.icon />
								<span className="ml-2 hidden md:inline">
									{item.name}
								</span>
							</div>
						</Link>
					</div>
				);
			})}
		</div>
	);
}
