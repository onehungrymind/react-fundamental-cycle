import React from 'react';

export default function Home() {
	const items = [
		{ id: 1, title: 'Legolas', desc: 'A Wood Elf', strength: 'Bow' },
		{ id: 2, title: 'Gimli', desc: 'A Dward', strength: 'Axe' },
		{ id: 3, title: 'Merry', desc: 'A Hobbit', strength: 'Courage' },
		{ id: 4, title: 'Pippin', desc: 'A SecondHobbit', strength: 'Stomach' }
	];
	const active = items[0];

	return (
		<div>
			<h1>Challenge 01 [Tim]</h1>
			<ul>
				{items.map(item => (
					<li key={item.id}>
					{item.title}
					</li>
				))}
			</ul>
			<div>
				<h2>{active.title}</h2>
				<p>{active.desc}</p>
				<p>{active.strength}</p>
			</div>
		</div>
	);
}