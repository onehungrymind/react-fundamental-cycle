/* 05 composition-with-card: Create Card presenter; compose Detail inside Card using children. */
import React from 'react';

function Card({children}:{children:React.ReactNode}){ return <div role="group">{children}</div>; }
export default function Solution(){ return <Card><h2>Detail</h2><p>Inside card</p></Card>; }
