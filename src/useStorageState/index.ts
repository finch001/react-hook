import { useState } from 'react';
import useUpdateEffect from '../useUpdateEffect';

// 定义函数接口描述
export type IFuncUpdater<T> = (previousState?: T) => T;

export type StorageStateDefaultValue<T> = T | IFuncUpdater<T>;

export type StorageStateResult<T> = [T | undefined, (value: StorageStateDefaultValue<T>) => void];

function isFunction<T>(obj: any): obj is T {
	return typeof obj === 'function';
}

function useStorageState<T>(
	storage: Storage,
	key: string,
	defaultValue?: StorageStateDefaultValue<T>,
): StorageStateResult<T> {
	const [state, setState] = useState<T | undefined>(() => getStoredValue());

	function getStoredValue() {
		const raw = storage.getItem(key);
		if (raw) {
			try {
				return JSON.parse(raw);
			} catch (error) {}
		}

		if (isFunction<IFuncUpdater<T>>(defaultValue)) {
			return defaultValue();
		}

		return defaultValue;
	}

	function updateState(value?: T | undefined | IFuncUpdater<T>) {
		// 执行层 用来执行更新 并且更新storage
		if (typeof value === 'undefined') {
			storage.removeItem(key);
			setState(undefined);
		} else if (isFunction<IFuncUpdater<T>>(value)) {
			const prevState = getStoredValue();
			const currentState = value(prevState);

			storage.setItem(key, JSON.stringify(currentState));
			setState(currentState);
		} else {
			storage.setItem(key, JSON.stringify(value));
			setState(value);
		}
	}

	// 如果key改变 需要state的值保持一致
	useUpdateEffect(() => {
		setState(getStoredValue());
	}, [key]);

	return [state, updateState];
}

export default useStorageState;
