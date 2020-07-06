import { useState, useMemo } from 'react';

type IState = string | number | boolean | undefined;

export interface Action<T = IState> {
	setLeft: () => void;
	setRight: () => void;
	toggle: (value?: T) => void;
}

function useToggle<T = boolean | undefined>(): [boolean, Action<T>];
function useToggle<T = IState>(defalutValue: T): [T, Action<T>];
function useToggle<T = IState, U = IState>(defaultValue: T, reverseValue?: U): [T | U, Action<T | U>];

function useToggle<D extends IState, R extends IState>(defalutValue: D = false as D, reverseValue?: R) {
	const [state, setState] = useState<D | R>(defalutValue);

	const reverseValueOrigin = useMemo(() => (reverseValue === undefined ? !defalutValue : reverseValue) as D | R, [
		reverseValue,
	]);

	const action = useMemo(() => {
		const toggle = (value?: D | R) => {
			// 处理点击传值的情况
			if (value !== undefined) {
				setState(value);
				return;
			}

			setState((s) => (s === defalutValue ? reverseValueOrigin : defalutValue));
		};

		const setLeft = () => setState(defalutValue);
		const setRight = () => setState(reverseValueOrigin);

		return { toggle, setLeft, setRight };
	}, [setState]);

	return [state, action];
}

export default useToggle;
