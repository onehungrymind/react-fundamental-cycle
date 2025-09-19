/* 
 * Separated out the ListItem component
 */

"use client";
import React from 'react';
import styles from './ListItem.module.css';

type ListItemProps = {
  title: string;
  desc: string;
  onSelect?: () => void;
};

// A presenter component
export default function ListItem( { title, desc , onSelect } : ListItemProps ) {
  return (
    <button onClick={onSelect} className={styles.selectable}>
      {title}
    </button>
  );
}
