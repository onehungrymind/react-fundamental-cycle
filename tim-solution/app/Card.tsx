/* Challenge 05 - timothy.allen@iem.com
 * Create a reusable `Card` Component
 */

"use client";
import React from 'react';

type CardProps = {
	children: React.ReactNode;
}

export default function Card({ children }) {
	return (
		<div> 
		{children}
		</div>
	);
}
