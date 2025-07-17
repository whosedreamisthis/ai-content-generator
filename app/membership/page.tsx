import React from 'react';
import PlanCard from '@/components/plan/plan-card';
import { Divide } from 'lucide-react';
export default function Page() {
	return (
		<div className="w-full">
			<h1 className="text-xl font-bold mt-10 text-center">
				Upgrade with monthly membership
			</h1>
			<div className="flex flex-wrap justify-center">
				<PlanCard image="/monthly.png" name="Monthly" />
				<PlanCard image="/free.png" name="Free" />
			</div>
			;
		</div>
	);
}
