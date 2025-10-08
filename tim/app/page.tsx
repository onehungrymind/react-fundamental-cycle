/* Challenge 06 - timothy.allen@iem.com
 * Add CSS styles to create visual separation
 * Establish a responsive layout structure
 * Style the list and detail sections distinctly
 * Ensure good visual hierarchy
 * Make the interface look polished and professional
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
         <h1>Challenge 06 [Tim]</h1>
         <ul>
            {items.map(item => (
               <li key={item.id}>
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
