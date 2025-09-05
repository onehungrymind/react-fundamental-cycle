"use client";

import React from 'react';
import ListItem from './ListItem';

export default function InteractiveList() {
	const items = [
		{ id: 1, title: 'Legolas', desc: 'A Wood Elf', strength: 'Bow' },
		{ id: 2, title: 'Gimli', desc: 'A Dward', strength: 'Axe' },
		{ id: 3, title: 'Merry', desc: 'A Hobbit', strength: 'Courage' },
		{ id: 4, title: 'Pippin', desc: 'A SecondHobbit', strength: 'Stomach' }
	];

	return (
		<ul>
			{items.map(item => (
				<li key={item.id}>
				<ListItem title={item.title} onSelect={() => {}} />
				</li>
			))}
		</ul>
	);
}
