import { useDraggable } from '@dnd-kit/core';
import { Paper, Typography } from '@mui/material';

function KanbanTaskCard({ task }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });        
    
    return (
        <Paper
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            sx={{
                p: 2,
                m: 1,
                backgroundColor: "white",
                transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
                cursor: "grab",
            }}
        >
            <Typography>{task.title}</Typography>
        </Paper>
    );
}

export default KanbanTaskCard