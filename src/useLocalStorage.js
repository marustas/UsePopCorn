import { useState, useEffect } from "react";
export function useLocalStorageState(initialState, key) {
    const [state, setState] = useState(function () {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    useEffect(
        function () {
            localStorage.setItem(key, JSON.stringify(state));
        }, [state, key]
    );
    return [state, setState]
}