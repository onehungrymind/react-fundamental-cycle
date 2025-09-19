"use client";
import React, { useState, useEffect } from 'react';
import Counter from './components/Counter';

export default function HomePage() {
	const [sharedCount, setSharedCount] = useState<number>(0);

	useEffect(() => {
		document.title = `The shared count is ${sharedCount}`;
		console.log(`You clicked ${sharedCount} times.`);
	}, [sharedCount]);

	const handleIncrement = () => {
		setSharedCount(prevCount => prevCount + 1);
	};

	const handleReset = () => {
		setSharedCount(0);
	};

	return (
		<main style={{ display: 'grid', placeContent: 'center', minHeight: '100vh' }}>
			<h1>Welcome to State Central!</h1>
			<Counter
			 title="Counter 1"
			 count={sharedCount}
			 onIncrement={handleIncrement}
			 onReset={handleReset}
			/>
			<Counter
			 title="Counter 2"
			 count={sharedCount}
			 onIncrement={handleIncrement}
			 onReset={handleReset}
			/>
		</main>
	);
}
