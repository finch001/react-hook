import React, { useState } from 'react';
// import { useCreation } from 'ahooks';

class Foo {
	constructor() {
		this.data = Math.random();
	}

	data: number;
}

export default function () {
	const foo = { data: {} };
	const [, setFlag] = useState({});
	return (
		<>
			<p>{foo.data}</p>
			<button
				type="button"
				onClick={() => {
					setFlag({});
				}}
			>
				Rerender
			</button>
		</>
	);
}
