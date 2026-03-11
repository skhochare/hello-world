import { useState, useCallback } from "react";

function useVisibility(initialVisibility = false) {
    const [isVisible, setIsVisible] = useState(initialVisibility);

    const show = useCallback(() => {
        setIsVisible(true);
    }, []);

    const hide = useCallback(() => {
        setIsVisible(false);
    }, []);

    const toggle = useCallback(() => {
        setIsVisible(prev => !prev);
    }, []);

    return {
        show,
        hide, 
        isVisible,
        toggle
    };
};

export default useVisibility;