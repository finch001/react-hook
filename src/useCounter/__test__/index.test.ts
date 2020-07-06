import { renderHook, act } from '@testing-library/react-hooks';
import useCounter, { Option } from '../index';

const setup = (init?: number, options?: Option) => renderHook(() => useCounter(init, options));

describe('useCounter', () => {
	it('should init counter', () => {
		const { result } = setup(100);
		const [current] = result.current;
		expect(current).toEqual(100);
	});

	it('useCounter should work correct', () => {
		const { result } = setup(100, { min: 10, max: 200 });
		const [current, { inc, dec, reset, set }] = result.current;

		expect(current).toBe(100);

		act(() => {
			inc();
		});
		expect(result.current[0]).toBe(101);

		act(() => {
			dec();
		});

		expect(result.current[0]).toBe(100);

		act(() => {
			dec(100);
		});

		expect(result.current[0]).toBe(10);

		act(() => {
			inc(300);
		});

		expect(result.current[0]).toBe(200);

		act(() => {
			reset();
		});

		expect(result.current[0]).toBe(100);

		act(() => {
			set(50);
		});

		expect(result.current[0]).toBe(50);
	});
});
