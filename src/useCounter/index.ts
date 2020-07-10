import { useMemo, useState } from 'react';
import useCreation from '../useCreation';

export interface Option {
	min?: number;
	max?: number;
}

export interface Actions {
	inc: (data?: number) => void;
	dec: (data?: number) => void;
	set: (data: number | ((c: number) => number)) => void;
	reset: () => void;
}

export default function useCounter(initialValue = 0, options: Option = {}): [number, Actions] {
	const { min, max } = options;

	// 返回 factor的值
	const init = useCreation(() => {
		if (typeof max === 'number') {
			return Math.min(initialValue, max);
		}

		if (typeof min === 'number') {
			return Math.max(min, initialValue);
		}

		return initialValue;
	}, []);

	const [current, setCurrent] = useState(init);

	const actions = useMemo((): Actions => {
		const setValue = (value: number | ((c: number) => number)) => {
			setCurrent((c: number) => {
				let target = typeof value === 'number' ? value : value(c);
				if (typeof max === 'number') {
					target = Math.min(max, target);
				}

				if (typeof min === 'number') {
					target = Math.max(min, target);
				}

				return target;
			});
		};

		const inc = (data = 1) => {
			setValue((c) => c + data);
		};

		const dec = (data = 1) => {
			setValue((c) => c - data);
		};

		const set = (data: number | ((c: number) => number)) => {
			setValue(data);
		};

		const reset = () => {
			setValue(init);
		};

		return { inc, dec, set, reset };
	}, []);

	return [current, actions];
}
