/* Challenge 04 - timothy.allen@iem.com
 * Separated out the ListItem component
 */

"use client";
import React from 'react';

type ListItemProps = {
	title: string;
	desc: string;
	onSelect?: () => void;
};

// A presenter component
export default function ListItem( { title, desc , onSelect } : ListItemProps ) {
	return (
		<button onClick={onSelect}>
			{title}
		</button>
	);
}
