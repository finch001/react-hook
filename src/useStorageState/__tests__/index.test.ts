import { renderHook, act } from '@testing-library/react-hooks';
import useStoreState, { IFuncUpdater } from '../index';

class TestStorage implements Storage {
	[name: string]: any;
	length: number = 0;

	_value = new Map<string, string>();

	clear(): void {
		this._value.clear();
		this.length = 0;
	}
	getItem(key: string): string {
		return this._value.get(key);
	}
	key(index: number): string {
		if (index >= this._value.size) {
			return null;
		}

		return Array.from(this._value.keys())[index];
	}
	removeItem(key: string): void {
		if (this._value.delete(key)) {
			this.length -= 1;
		}
	}
	setItem(key: string, value: string): void {
		if (!this._value.has(key)) {
			this.length += 1;
		}
		this._value.set(key, value);
	}
}

interface StorageStateProps<T> {
	key: string;
	defaultValue?: T | IFuncUpdater<T>;
}

describe('useStorageState', () => {
	const setup = <T>(props: StorageStateProps<T>) => {
		const storage = new TestStorage();

		return renderHook(
			({ key, defaultValue }: StorageStateProps<T>) => {
				const [state, setState] = useStoreState(storage, key, defaultValue);
				return { state, setState };
			},
			{ initialProps: props },
		);
	};

	it('useStoreState defined', () => {
		expect(useStoreState).toBeDefined();
	});

	it('Storage should work', () => {
		const hook = setup({ key: 'key1', defaultValue: 'value1' });
		expect(hook.result.current.state).toBe('value1');

		hook.rerender({ key: 'key2', defaultValue: 'value2' });
		expect(hook.result.current.state).toBe('value2');
	});

	it('should get default and set value for a given key', () => {
		const hook = setup({ key: 'key', defaultValue: 'defaultValue' });
		expect(hook.result.current.state).toEqual('defaultValue');

		act(() => {
			hook.result.current.setState('setValue');
		});

		expect(hook.result.current.state).toEqual('setValue');

		hook.rerender({ key: 'key' });
		expect(hook.result.current.state).toEqual('setValue');
	});

	it('should remove value for a given key', () => {
		const hook = setup({ key: 'key' });

		act(() => {
			hook.result.current.setState('value');
		});
		expect(hook.result.current.state).toEqual('value');

		act(() => {
			hook.result.current.setState(undefined);
		});

		expect(hook.result.current.state).toBeUndefined();
	});
});
