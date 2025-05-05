import { useEffect, useState } from 'react';

const useDebounce = <T>(value: T, delay = 500): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (JSON.stringify(debouncedValue) !== JSON.stringify(value)) {
                setDebouncedValue(value)
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;