/* Challenge 08 - timothy.allen@iem.com
 * Add a controlled search input field
 * Filter items based on search text
 * Update the list in real-time as user types
 * Handle empty search results gracefully
 * Maintain selection state during filtering
 */

"use client";
import React from 'react';
import { useState } from 'react';
import ListItem from './ListItem';
import Card from './Card';
import styles from './Home.module.css';

export default function Home() {
   // Dynamic list rendering from data array
   const items = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      desc: `Item ${i + 1} is remarkably reliable`,
      title: `Item ${i + 1}`
   }));
   
   // Use state to maintain which ListItem is selected
   const [active, setActive] = useState<number | undefined>();
   const [searchTerm, setSearchTerm] =  useState('');
   const selectedItem = items.find(i => i.id === active);
   const filtered = items.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()));

   // Call the ListItem component with the dynamic list items
   return (
      <div className={styles.container}>
         <div>
         <h1>Challenge 08 [Tim]</h1>
	 <label>
	    Search:
	    <input
	       name="searchTerm"
               value={searchTerm}
               onChange={e => {
                  setSearchTerm(e.target.value);
	       }}
	    />
	 </label>
         <ul className={styles.listSection}>
            { filtered.length > 0 ? 
	       filtered.map(item => (
               <li key={item.id} className={item.id === active ? styles.selectedItem : styles.notSelectedItem}>
               <ListItem title={item.title} onSelect={ ()=>{ setActive(item.id) } } />
               </li>
            )) : <li>No results</li>}
         </ul>
         </div>
         <div className={styles.cardSection}>
         <Card>
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
      </div>
   );
}
