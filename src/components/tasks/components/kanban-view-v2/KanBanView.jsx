import { useEffect, useRef, useState } from "react";
import Muuri from "muuri";
import '../../styles/kanban.css';
import TaskItem from './TaskItem';

export default function KanbanView() {
    const dragContainerRef = useRef(null);
    const boardRef = useRef(null);
    const columnRefs = useRef([]);

    const [ openTask, setOpenTask ] = useState(null);
    const [ checkValue, setCheckValue ] = useState([]);

    const columnList = [
        "Công việc mới",
        "Đang thực hiện",
        "Kiểm thử",
        "Hoàn thành",
        "Đóng công việc",
        "Tạm dừng",
        "Khóa công việc",
    ]

    const initialTaskList = [
        { id: 1, content: "Task 1", column: "Công việc mới" },
        { id: 2, content: "Task 2", column: "Công việc mới" },
        { id: 3, content: "Task 3", column: "Đang thực hiện" },
        { id: 4, content: "Task 4", column: "Hoàn thành" },
    ];

    useEffect(() => {
        const columnGrids = columnRefs.current.map((container) => {
            return new Muuri(container, {
                items: ".board-item",
                dragEnabled: true,
                dragSort: () => columnGrids,
                dragContainer: dragContainerRef.current,
                dragAutoScroll: {
                    targets: (item) => [
                        { element: window, priority: 0 },
                        {
                            element: item.getGrid().getElement().parentNode,
                            priority: 1,
                        },
                    ],
                },
                dragStartPredicate: (item, event) => {
                    const isCheckbox = event.target.type === "checkbox";
                    if (isCheckbox) {
                        return false;
                    }
                    return Muuri.ItemDrag.defaultStartPredicate(item, event);
                },
            })
            .on("dragInit", (item) => {
                item.getElement().style.width = `${item.getWidth()}px`;
                item.getElement().style.height = `${item.getHeight()}px`;
            })
            .on("dragReleaseEnd", (item) => {
                item.getElement().style.width = "";
                item.getElement().style.height = "";
                item.getGrid().refreshItems([item]);
            })
            .on("layoutStart", () => {
                boardGrid.refreshItems().layout();
            });
        });

        const boardGrid = new Muuri(boardRef.current, {
            dragEnabled: true,
            dragHandle: ".board-column-header",
        });

        return () => {
            columnGrids.forEach((grid) => grid.destroy());
            boardGrid.destroy();
        };
    }, []);

    useEffect(() => {
        console.log(checkValue);
    }, [checkValue]);

    useEffect(() => {
        console.log(openTask);
    }, [openTask]);

    return (
        <div>
            <div className="drag-container" ref={dragContainerRef}></div>
            <div className="board" ref={boardRef}>
                { columnList.map((column, i) => (
                    <div className="board-column px-1 absolute top-0 left-0 bg-[#f3f4f6]"
                        key={`col_${i}`}
                    >
                        <div className="board-column-container border rounded-md shadow-md" key={`col_container_${i}`}>
                            <div className="board-column-header"
                                key={`col_header_${i}`}>{column}</div>
                            <div className="board-column-content-wrapper" key={`col_wrapper_${i}`}>
                                <div
                                    key={`col_content_${i}`}
                                    className="board-column-content"
                                    ref={(el) => (columnRefs.current[i] = el)}
                                >
                                    {initialTaskList.map((task) => (
                                        <TaskItem
                                            key={`col_${i}-${task.id}`}
                                            i={i}
                                            taskKey={`col_${i}-${task.id}`}
                                            task={task}
                                            checkValue={checkValue}
                                            setCheckValue={setCheckValue}
                                            setOpenTask={setOpenTask}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
