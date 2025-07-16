// DashboardLayout.tsx
import React from 'react';
import SideNav from '@/components/nav/side-nav';

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-row h-screen gap-4 w-full justify-center">
			{/* SideNav column */}
			{/* w-1/4 (or your desired fixed width like w-64) for sidebar width */}
			<div className="w-1/4 h-full">
				<SideNav />
			</div>
			{/* Main content column */}
			{/* flex-1 takes remaining horizontal space. h-full ensures vertical fill. */}
			{/* overflow-y-auto enables internal scrolling for this column. */}
			{/* The bg-amber-500 is for debugging; you can remove it. */}
			<div className="flex-1 overflow-y-auto ">{children}</div>
		</div>
	);
}
