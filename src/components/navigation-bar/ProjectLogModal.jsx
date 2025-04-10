import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function ProjectLogModal({ open, onClose, logs = [] }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                📝 Nhật ký dự án
                <IconButton edge="end" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                {logs.length > 0 ? (
                    <List>
                        {logs.map((log, index) => (
                            <ListItem key={index} alignItems="flex-start">
                                <ListItemIcon>
                                    <AccessTimeIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" fontWeight="500">
                                            {log.message}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary">
                                            {log.date}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Box textAlign="center" py={4}>
                        <Typography variant="body2" color="text.secondary">
                            Không có nhật ký nào.
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
