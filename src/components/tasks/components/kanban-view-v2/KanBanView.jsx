import { useEffect, useRef } from "react";
import Muuri from "muuri";
import '../../styles/kanban.css'

export default function KanBanView() {
    const dragContainerRef = useRef(null);
    const boardRef = useRef(null);
    const columnRefs = useRef([]);

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

    return (
        <div>
            <div className="drag-container" ref={dragContainerRef}></div>
            <div className="board" ref={boardRef}>
                { columnList.map((column, i) => (
                    <div className="board-column todo">
                        <div className="board-column-container">
                            <div className="board-column-header">{column}</div>
                            <div className="board-column-content-wrapper">
                                <div
                                    className="board-column-content"
                                    ref={(el) => (columnRefs.current[i] = el)}
                                >
                                    {initialTaskList.map((task, j) => (
                                        <div
                                            className="board-item"
                                            key={`${i}-${task.id}`}
                                        >
                                            <div className="board-item-content">
                                                <span>Item #</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {/* <div className="board-column todo">
                    <div className="board-column-container">
                        <div className="board-column-header">Todo</div>
                        <div className="board-column-content-wrapper">
                            <div
                                className="board-column-content"
                                ref={(el) => (columnRefs.current[0] = el)}
                            >
                                {initialTaskList.map((task, j) => (
                                    <div
                                        className="board-item"
                                        key={`todo-${task.id}`}
                                    >
                                        <div className="board-item-content">
                                            <span>Item </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="board-column working">
                    <div className="board-column-container">
                        <div className="board-column-header">Working</div>
                        <div className="board-column-content-wrapper">
                            <div
                                className="board-column-content"
                                ref={(el) => (columnRefs.current[1] = el)}
                            >
                                {initialTaskList.map((task, j) => (
                                    <div
                                        className="board-item"
                                        key={`working-${task.id}`}
                                    >
                                        <div className="board-item-content">
                                            <span>Item #</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="board-column done">
                    <div className="board-column-container">
                        <div className="board-column-header">Done</div>
                        <div className="board-column-content-wrapper">
                            <div
                                className="board-column-content"
                                ref={(el) => (columnRefs.current[2] = el)}
                            >
                                {initialTaskList.map((task, j) => (
                                    <div
                                        className="board-item"
                                        key={`done-${task.id}`}
                                    >
                                        <div className="board-item-content">
                                            <span>Item #</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div> */}

            </div>
        </div>
    );
};
