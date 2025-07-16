'use client';
import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { usageCount } from '@/actions/ai';
import { useUser } from '@clerk/nextjs';

interface UsageContextType {
	count: number;
}
const UsageContext = createContext<UsageContextType | null>(null);
export const UsageProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const [count, setCount] = useState(0);
	const { user } = useUser();
	const email = user?.primaryEmailAddress?.emailAddress || '';

	useEffect(() => {
		if (email) {
			fetchUsage(email);
		}
	}, [email]);

	const fetchUsage = async (email: string) => {
		const res = await usageCount(email);
		setCount(res);
	};

	return (
		<UsageContext.Provider value={{ count }}>
			{children}
		</UsageContext.Provider>
	);
};

export const useUsage = () => {
	const context = useContext(UsageContext);
	if (context === null) {
		throw new Error('useUSage must be used within a UsageProvider');
	}
	return context;
};
