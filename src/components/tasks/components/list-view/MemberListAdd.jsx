// src/components/memberListAdd/MemberListAdd.jsx
import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    IconButton,
    Typography,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Button,
} from "@mui/material";
import "../../styles/MemberListAdd.scss";
import CloseIcon from "@mui/icons-material/Close";
import { addMemberTask } from "@/services/issueService";
import { getlistUserInProjects } from "@/services/taskService";

export default function MemberListContentAdd({ onClose, idProject, task, fetchApi, toast }) {
    const [listMember, setListMember] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);

    const getMemberByProject = async () => {
        const response = await getlistUserInProjects(idProject);
        if (response.data.success === true) {
            setListMember(response.data.data);
        }
    };

    useEffect(() => {
        getMemberByProject();
        setCheckedItems(task?.assigneeId.map((i) => i._id) || []);
    }, [idProject, task]);

    const handleCheckboxChange = (item) => {
        setCheckedItems((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
        );
    };

    const addMember = async () => {
        const response = await addMemberTask(task._id, {
            "userId": checkedItems,
        });
        if (response.success) {
            toast.success(response.message);
            fetchApi(); // Cập nhật lại danh sách
        } else {
            toast.error(response.message);
        }
        onClose();
    };

    return (
        <Box
            sx={{
                width: "343px",
                position: "relative",
                paddingLeft: "14px",
                paddingBottom: "60px",
                height: "550px",
            }}
        >
            <Box sx={{ position: "absolute", right: "10px", top: "-13px" }}>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Typography
                sx={{
                    marginTop: "28px",
                    color: "#485F7E",
                    fontSize: "18px",
                    marginBottom: "15px",
                }}
                fontWeight="bold"
            >
                Danh sách thành viên
            </Typography>
            <FormGroup>
                {listMember?.map((member, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                checked={checkedItems.includes(member._id)}
                                onChange={() => handleCheckboxChange(member._id)}
                            />
                        }
                        label={
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar src={member?.avatar} />
                                <Typography sx={{ ml: 1 }}>{member.userName}</Typography>
                            </Box>
                        }
                    />
                ))}
                <Button variant="contained" onClick={addMember} style={{ marginBottom: "20px" }}>
                    Chọn
                </Button>
            </FormGroup>
        </Box>
    );
}
