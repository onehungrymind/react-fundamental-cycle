// Challenge 02 - timothy.allen@iem.com
import React from 'react';

// A presenter component
function ListItem({ title, desc } : { title: string; desc: string; }) {
	return (
		<button>
			{title}
		</button>
	);
}

export default function Home() {
	// Keep data separate from presentation
	const items = [
		{ id: 1, title: 'Legolas', desc: 'A Wood Elf', strength: 'Bow' },
		{ id: 2, title: 'Gimli', desc: 'A Dward', strength: 'Axe' },
		{ id: 3, title: 'Merry', desc: 'A Hobbit', strength: 'Courage' },
		{ id: 4, title: 'Pippin', desc: 'A SecondHobbit', strength: 'Stomach' }
	];

	// Call the presenter component from here
	return (
		<ul>
			{items.map(item => (
				<li key={item.id}>
				<ListItem title={item.title} desc={item.desc} />
				</li>
			))}
		</ul>
	);
}
