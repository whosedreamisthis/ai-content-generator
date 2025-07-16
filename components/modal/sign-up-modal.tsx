import React from 'react';
import { useUsage } from '@/context/usage';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import Link from 'next/link';
export default function SignUpModal() {
	const { openModal, setOpenModal } = useUsage();
	return (
		<Dialog
			open={openModal}
			onOpenChange={() =>
				openModal ? setOpenModal(!openModal) : setOpenModal(openModal)
			}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						🚀 Unlock Unlimited AI-Powered Content!
					</DialogTitle>
					<br />
					<DialogDescription>
						<p>
							Congrats! You have generated 10,000 words with our
							AI tool. That's amazing!
						</p>
						<p>
							🔒 Ready to take your content creation to the next
							level? Upgrate to a paid plan and enjoy!
						</p>
						<ul className="mt-5">
							<li>🔥 Unlimited AI-powered content.</li>
							<li>🔥 Priority support</li>
							<li>🔥 No ads</li>
						</ul>
						<p className="mt-5">
							💡Don't let your creativity his a wall. Upgrade now
							and keep the ideas flowing!
						</p>
						<div className="m-5 text-center">
							<Link href="/membership">
								<Button className="focus-visible:outline-none focus-visible:ring-0">
									Join Membership
								</Button>
							</Link>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
