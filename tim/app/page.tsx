/* Challenge 05 - timothy.allen@iem.com
- Create a reusable `Card` component
- Use children prop to compose content inside the Card
- Wrap the Detail view with the Card component
- Maintain consistent styling and layout
- Demonstrate component composition patterns
 */

"use client";
import React from 'react';
import { useState } from 'react';
import ListItem from './ListItem';
import Card from './Card';

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
			<ul>
				{items.map(item => (
					<li key={item.id}>
					<ListItem title={item.title} onSelect={ ()=>{ setActive(item.id) } } />
					</li>
				))}
			</ul>
			<Card>
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
			</Card>
		</div>
	);
}
