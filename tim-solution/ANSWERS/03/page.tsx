// Challenge 03 - timothy.allen@iem.com
"use client";
import React from 'react';
// We will use state to maintain which item is selected
import { useState } from 'react';

// A presenter component
function ListItem({ title, desc , onSelect } : { title: string; desc: string; onSelect?: () => void }) {
	return (
		<button onClick={onSelect}>
			{title}
		</button>
	);
}

export default function Home() {
	// Keep data separate from presentation
	const heroes = [
		{ id: 1, title: 'Legolas', desc: 'A Wood Elf', strength: 'Bow' },
		{ id: 2, title: 'Gimli', desc: 'A Dward', strength: 'Axe' },
		{ id: 3, title: 'Merry', desc: 'A Hobbit', strength: 'Courage' },
		{ id: 4, title: 'Pippin', desc: 'A SecondHobbit', strength: 'Stomach' }
	];
	
	// Use state to maintain which ListItem is selected
	const [activeListItem, setActiveListItem] = useState();


	// Call the presenter component from here
	return (
		<div>
		<ul>
			{heroes.map(hero => (
				<li key={hero.id}>
				<ListItem title={hero.title} desc={hero.desc} onSelect={ ()=>{ setActiveListItem(hero.id) } } />
				</li>
			))}
		</ul>
		{ <h1> { activeListItem ? heroes[activeListItem].id : "nothing" } </h1> }
		</div>
	);
}
