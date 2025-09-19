/* 
 * Create a reusable `Card` Component
 */

"use client";
import React from 'react';

type CardProps = {
  children: React.ReactNode;
}

export default function Card({ children }) {
  return (
    <div role="group"> 
    {children}
    </div>
  );
}
