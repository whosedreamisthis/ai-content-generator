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

	console.log(path);
	return (
		<div className="h-screen p-5 shadow-sm border">
			{menu.map((item, index) => {
				return (
					<div
						key={index}
						className={`${
							path === item.path
								? 'bg-primary text-white'
								: 'hover:bg-primary hover:text-white'
						} flex m-2 mr-4 p-2  rounded-lg cursor-pointer`}
					>
						<Link href={item.path}>
							<div className="flex gap-4">
								<item.icon />
								<span className="ml-2">{item.name}</span>
							</div>
						</Link>
					</div>
				);
			})}
		</div>
	);
}
