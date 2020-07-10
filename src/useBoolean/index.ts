import { useMemo } from 'react';
import useToggle from '../useToggle';

export interface Action {
	setTrue: () => void;
	setFalse: () => void;
	toggle: (value?: boolean | undefined) => void;
}

export default function useBoolean(defaultValue = false): [boolean, Action] {
	const [state, { toggle }] = useToggle(defaultValue);

	const action: Action = useMemo(() => {
		const setTrue = () => toggle(true);
		const setFalse = () => toggle(false);

		return { toggle, setTrue, setFalse };
	}, [toggle]);

	return [state, action];
}
