// DashboardLayout.tsx
import React from 'react';
import SideNav from '@/components/nav/side-nav';
import MobileNav from '@/components/nav/mobile-nav';
export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-row h-screen w-full">
			{/* SideNav column - hidden on small screens, shown on medium and larger */}
			<div className="hidden md:block w-1/4 h-full">
				<SideNav />
			</div>

			{/* Main content area, including MobileNav for small screens */}
			<div className="flex-1 flex flex-col h-full overflow-y-auto">
				{/* MobileNav - shown on small screens, hidden on medium and larger */}
				<div className="md:hidden">
					<MobileNav />
				</div>
				<div className="p-4 sm:p-6 lg:p-8 flex-1">
					{' '}
					{/* Added some padding to children for better spacing */}
					{children}
				</div>
				{/* Children will fill the remaining space below MobileNav on small screens, or be the primary content on larger screens */}
			</div>
		</div>
	);
}
