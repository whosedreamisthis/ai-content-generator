import React from 'react';
// import DashboardLayout from './layout';
import template from '@/utils/template';
import Image from 'next/image';
import { Divide } from 'lucide-react';
export default function Page() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
			{template.map((item) => {
				return (
					<div
						key={item.slug}
						className="p-5 shadow-md rounded-md border flex flex-col gap-3 cursor-pointer hover:scale-105 transition-all"
					>
						<Image
							src={item.icon}
							alt={item.name}
							width={50}
							height={50}
						/>
						<h2 className="font-medium text-lg">{item.name}</h2>
						<p className="text-gray-500 line-clamp-3">
							{item.desc}
						</p>
					</div>
				);
			})}
		</div>
	);
}
