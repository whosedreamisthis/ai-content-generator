import React from 'react';
import SideNav from '@/components/nav/side-nav';
export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid grid-cols-4 gap-4">
			<div className="col-span-1">
				<SideNav />
			</div>
			<div className="col-span-3">
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Earum laborum explicabo, vero recusandae sint blanditiis
					necessitatibus quaerat, architecto ab voluptatum illo veniam
					expedita tempore quae. Nulla quaerat officia fuga ipsam.
				</p>
			</div>
		</div>
	);
}
