"use client";
import React from 'react';

export default function ListItem({ title, onSelect } : { title: string; onSelect?: () => void }) {
	return (
		<button onClick={onSelect}>
			{title}
		</button>
	);
}
