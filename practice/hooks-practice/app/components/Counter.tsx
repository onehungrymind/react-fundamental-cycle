"use client";
import React from 'react';

interface CounterProps {
	title: string;
	count: number;
	onIncrement: () => void;
	onReset: () => void;
}

const Counter: React.FC<CounterProps> = ({ title, count, onIncrement, onReset }) => {
	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
		<h2>My Interactive Counter</h2>
		<p style={{ fontSize: '2rem', margin: '10px' }}>{count}</p>
		<button onClick={onIncrement}>
		Click me
		</button>
		<button onClick={onReset} style={{marginLeft: '10px'}}>
		Reset
		</button>
		</div>
	);
}

export default Counter;
