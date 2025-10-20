/* Challenge 10 - timothy.allen@iem.com
 * Create a controlled form for adding new items
 * Validate form inputs appropriately
Add new items to the list on form submission
Clear form after successful submission
Handle form submission events properly
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
         <h1>Challenge 10 [Tim]</h1>
         <h2>DATABASE ACCESS</h2>
         <label>
           New HOBBIT Item:
             <form>
             Id: <input/><br/>
             Desc: <input/>
             </form>
          </label>
          <hr/>
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
