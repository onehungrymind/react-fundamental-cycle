// Challenge 02 - timothy.allen@iem.com
"use client";
import React from 'react';

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
	const active = heroes[0];

	// Call the presenter component from here
	// this interactivity is temporary, just trying out passing an event handler
	return (
		<div>
			<ul>
				{heroes.map(hero => (
					<li key={hero.id}>
					<ListItem title={hero.title} desc={hero.desc} onSelect={ ()=>{window.alert("You clicked " + hero.title )} } />
					</li>
				))}
			</ul>
			<hr/>
			<div>
				<h2>{active.title}</h2>
				<p>{active.desc}</p>
				<p>{active.strength}</p>
			</div>
		</div>
	);
}
