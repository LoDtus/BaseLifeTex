import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import KanbanTaskCard from './KanbanTaskCard';

function KanbanColumn({ columnId, tasks }) {
    const { setNodeRef } = useDroppable({ id: columnId });        
    
    return (
        <div ref={setNodeRef} style={{minHeight: "200px", padding: "10px", backgroundColor: "#e3e3e3"}}>
            {tasks.map((task) => (
                <KanbanTaskCard key={task.id} task={task} />
            ))}
        </div>
    )
}

export default KanbanColumn