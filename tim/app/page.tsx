/* Challenge 07 - timothy.allen@iem.com
 * Add click handlers to list items
 * Store selected item ID in state using `useState`
 * Update detail view when an item is selected
 * Provide visual feedback for selected items
 * Handle the initial state (no selection)
 */

"use client";
import React from 'react';
import { useState } from 'react';
import ListItem from './ListItem';
import Card from './Card';
import styles from './Home.module.css';

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
      <div className={styles.container}>
         <div className={styles.listSection}>
         <h1>Challenge 07 [Tim]</h1>
         <ul>
            {items.map(item => (
               <li key={item.id} className={item.id === active ? styles.selectedItem : styles.notSelectedItem}>
               <ListItem title={item.title} onSelect={ ()=>{ setActive(item.id) } } />
               </li>
            ))}
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
