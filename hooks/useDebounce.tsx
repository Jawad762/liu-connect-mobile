import React, { DependencyList, useEffect } from 'react'

const useDebounce = ({
    action,
    delay,
    dependencies = [],
}: {
    action: () => void,
    delay: number,
    dependencies?: DependencyList
}) => {
    useEffect(() => {
        const timer = setTimeout(action, delay);
        return () => clearTimeout(timer);
    }, [...dependencies, delay]);
}

export default useDebounce