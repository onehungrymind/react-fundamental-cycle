/* Challenge 04 - timothy.allen@iem.com
 * Convert hardcoded items to a data array
 * Use `.map()` to render list items dynamically
 * Add unique `key` props for each list item
 * Maintain the same visual appearance
 * Ensure proper React rendering optimization
 */

"use client";
import React from 'react';
import { useState } from 'react';
import ListItem from './ListItem';

export default function Home() {
	// Dynamic list rendering from data array
	const items = Array.from({ length: 7 }, (_, i) => ({
		id: i + 1,
		desc: `Item ${i + 1} is remarkably reliable`,
		title: `Item ${i + 1}`
	}));
	
	// Use state to maintain which ListItem is selected
	const [active, setActive] = useState<number | undefined>();
	const selectedItem = items.find(i => i.id === active);

	// Call the ListItem component with the dynamic list items
	return (
		<div>
			<h1>Challenge 04 [Tim]</h1>
			<ul>
				{items.map(item => (
					<li key={item.id}>
					<ListItem title={item.title} onSelect={ ()=>{ setActive(item.id) } } />
					</li>
				))}
			</ul>
			<hr/>
			{ selectedItem ? (
				<div>
					<h2>{ selectedItem.title }</h2>
					<p>id: { selectedItem.id }</p>
					<p>desc: { selectedItem.desc }</p>
				</div>
			) : (
				<h2>Select a item!</h2>
			)}
		</div>
	);
}
