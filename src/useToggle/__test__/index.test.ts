import { renderHook, act } from '@testing-library/react-hooks';
import useToggle from '../index';

describe('useToggle', () => {
	it('should be defined', () => {
		expect(useToggle).toBeDefined();
	});

	it('test for init', () => {
		const hook = renderHook(() => useToggle());
		expect(hook.result.current[0]).toBeFalsy();
	});

	it('test on method', () => {
		const hook = renderHook(() => useToggle('Hello'));
		expect(hook.result.current[0]).toEqual('Hello');

		act(() => {
			hook.result.current[1].toggle();
		});

		expect(hook.result.current[0]).toBeFalsy();

		act(() => {
			hook.result.current[1].toggle();
		});

		expect(hook.result.current[0]).toBeTruthy();

		act(() => {
			hook.result.current[1].setLeft();
		});

		expect(hook.result.current[0]).toEqual('Hello');

		act(() => {
			hook.result.current[1].setRight();
		});

		expect(hook.result.current[0]).toBeFalsy();
	});

	it('test for option', () => {
		const hook = renderHook(() => useToggle('Hello', 'World'));
		expect(hook.result.current[0]).toEqual('Hello');
		act(() => {
			hook.result.current[1].toggle();
		});

		expect(hook.result.current[0]).toEqual('World');

		act(() => {
			hook.result.current[1].toggle();
		});

		expect(hook.result.current[0]).toEqual('Hello');

		act(() => {
			hook.result.current[1].setLeft();
		});

		expect(hook.result.current[0]).toEqual('Hello');

		act(() => {
			hook.result.current[1].setRight();
		});

		expect(hook.result.current[0]).toEqual('World');
	});
});
