// propertiesHook: Lưu các Hook được dùng để xử lý các thuộc tính nhỏ lẻ về giao diện, UI
import { useState, useEffect, useRef } from "react";

// Hook lưu và cập nhật trạng thái của các input. Hook sẽ nhận và trả về một mảng các trạng thái của các input.
// Nếu có input nào được nhập thì trạng thái sẽ là true, và ngược lại là false
function useInputStates(inputs) {
    const [hasText, setHasText] = useState(inputs.map(() => false));
    const prevInputsRef = useRef(inputs);

    useEffect(() => {
        if (!prevInputsRef.current.every((val, idx) => val === inputs[idx])) {
            setHasText(inputs.map((input) => input.length > 0));
            prevInputsRef.current = inputs;
        }
    }, [inputs]);

    return hasText;
}

export { useInputStates };