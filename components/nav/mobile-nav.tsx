import React from 'react';
import { Menu } from 'lucide-react';
import SideNav from './side-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
export default function MobileNav() {
	return (
		<div>
			<div className="px-4 mb-2/ bg-slate-50 dark:bg-slate-900">
				{/* <SideNav /> */}
				<Sheet>
					<SheetTrigger className="md:hidden">
						<div className="p-2">
							<Menu size={50} />
						</div>
					</SheetTrigger>
					<SheetContent side="left" className="w-[300px]">
						<SideNav />
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
}
