import { useEffect, useRef } from "react";
import Muuri from "muuri";
import '../../styles/kanban.css'

export default function KanBanView() {
    const dragContainerRef = useRef(null);
    const boardRef = useRef(null);
    const columnRefs = useRef([]);

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
                <div className="board-column todo">
                    <div className="board-column-container">
                        <div className="board-column-header">Todo</div>
                        <div className="board-column-content-wrapper">
                            <div
                                className="board-column-content"
                                ref={(el) => (columnRefs.current[0] = el)}
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <div
                                        className="board-item"
                                        key={`todo-${num}`}
                                    >
                                        <div className="board-item-content">
                                            <span>Item #</span>
                                            {num}
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
                                {[6, 7, 8, 9, 10].map((num) => (
                                    <div
                                        className="board-item"
                                        key={`working-${num}`}
                                    >
                                        <div className="board-item-content">
                                            <span>Item #</span>
                                            {num}
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
                                {[11, 12, 13, 14, 15].map((num) => (
                                    <div
                                        className="board-item"
                                        key={`done-${num}`}
                                    >
                                        <div className="board-item-content">
                                            <span>Item #</span>
                                            {num}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
