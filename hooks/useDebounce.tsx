import React, { useEffect } from 'react'

const useDebounce = ({ action, delay }: { action: () => void, delay: number }) => {
    useEffect(() => {
        const timer = setTimeout(action, delay);
        return () => clearTimeout(timer);
    }, [action, delay]);
}

export default useDebounce