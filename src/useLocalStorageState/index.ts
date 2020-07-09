import useStorageState from '../useStorageState';

function useLocalStorageState<T = undefined>(
	key: string,
): [T | undefined, (value?: T | ((previouState?: T) => T)) => void];

function useLocalStorageState<T>(
	key: string,
	defaultValue: T | (() => T),
): [T, (value?: T | ((previouState?: T) => T)) => void];

function useLocalStorageState<T>(key: string, defaultValue?: T | (() => T)) {
	return useStorageState(localStorage, key, defaultValue);
}

export default useLocalStorageState;
