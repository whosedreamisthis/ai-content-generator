// page.tsx (For History Page)
'use client';
import React, { useState, useEffect } from 'react';
import { getQueries } from '@/actions/ai';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Divide, Loader2Icon } from 'lucide-react';
import QueryTable from '@/components/table/query-table';

export default function Page() {
	return <div> This is the settings page. </div>;
}
