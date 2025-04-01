import '../../styles/taskItem.css';

export default function TaskItem({ i, taskKey, task, checkValue, setCheckValue, setOpenTask }) {
    function chooseTask(e) {
        e.stopPropagation();
        console.log(taskKey);
        // setCheckValue(prev => {
        //     if (prev.includes(taskKey)) {
        //         return prev.filter(id => id !== taskKey);
        //     } else {
        //         return [...prev, taskKey];
        //     }
        // });
        if (checkValue.includes(taskKey)) {
            let temp = checkValue.filter(item => item !== taskKey);
            setCheckValue(temp);
        } else {
            setCheckValue(prev => [...prev, taskKey]);
        }
    }

    return (
        <div
            className="board-item"
        >
            <div className="board-item-content">
                <div className="d-flex">
                    <div className="board-item-title text-[10px]">Lorem ipsum dolor sit amet</div>
                    <input
                        className="board-item-check"
                        type="checkbox"
                        checked={checkValue.includes(taskKey)}
                        onClick={chooseTask}
                        onChange={chooseTask}
                    />
                </div>
                <div className="d-flex">
                    <div className="board-item-date text-[10px]">01/05/2025</div>
                    <span className="board-item-status text-[10px]">Chưa giao</span>
                </div>
            </div>
        </div>
    );
};