import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  DialogTitle,
  DialogActions,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@mui/icons-material";
import { Input } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const users = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Người dùng ${i + 1}`,
  email: `user${i + 1}@gmail.com`,
}));

const ProjectSettingPopover = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const [selectedRoles, setSelectedRoles] = useState([]);

  const handleRoleChange = (event) => {
    const { value } = event.target;
    setSelectedRoles(value);
  };

  const [selected, setSelected] = useState([]);

  const users = [
    { id: 1, name: "Ngô Tiến Đạt", email: "datnt050224@gmail.com" },
    { id: 2, name: "Nguyễn Văn A", email: "a@gmail.com" },
    { id: 3, name: "Trần Thị B", email: "b@gmail.com" },
  ];

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = users.map((user) => user.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected = selected.length === users.length;
  const isIndeterminate = selected.length > 0 && selected.length < users.length;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openPermissionMatrix, setOpenPermissionMatrix] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleOpenMatrix = (user) => {
    setCurrentUser(user);
    setOpenPermissionMatrix(true);
  };

  const handleCloseMatrix = () => {
    setOpenPermissionMatrix(false);
    setCurrentUser(null);
  };

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const currentPageIds = paginatedUsers.map((u) => u.id);
  const ROLES = ["Test", "Dev", "PM", "USER"];
  const PERMISSIONS = ["View", "Add", "Edit", "Delete", "Comment", "Drag"];

  const initialTableData = ROLES.map((role) => ({
    role,
    permissions: {
      View: true,
      Add: false,
      Edit: false,
      Delete: false,
      Comment: true,
      Drag: true,
    },
  }));

  const [showMatrix, setShowMatrix] = useState(false);
  const [tableData, setTableData] = useState(initialTableData);

  const toggleMatrix = () => setShowMatrix(!showMatrix);

  const handleSelectRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleDeletePermissions = () => {
    const updated = tableData.map((item) => {
      if (selectedRoles.includes(item.role)) {
        return {
          ...item,
          permissions: PERMISSIONS.reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, {}),
        };
      }
      return item;
    });
    setTableData(updated);
    setSelectedRoles([]);
  };
  const handleDeleteSelectedUsers = () => {
    const updated = users.filter((user) => !selected.includes(user.id));
    setUsers(updated);
    setSelected([]);
  };

  const handleDeleteUser = (id) => {
    const updated = users.filter((user) => user.id !== id);
    setUsers(updated);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{ display: "flex", p: 0, height: 600 }}>
        {/* Sidebar */}
        <Box sx={{ width: "20%", bgcolor: "#f1f1f1", p: 2 }}>
          <Tabs
            orientation="vertical"
            value={tabIndex}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ height: "100%" }}
          >
            <Tab label="Quản lý luồng" />
            <Tab label="Quản lý vai trò" />
          </Tabs>
        </Box>

        {/* Main Content */}
        <Box sx={{ width: "80%", p: 3, overflowY: "auto" }}>
          {/* Tab 0: Quản lý luồng */}
          {tabIndex === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                TRẠNG THÁI
              </Typography>
              <Box sx={{ display: "flex", gap: 3 }}>
                {/* Left: Trạng thái */}
                <Box sx={{ flex: 1 }}>
                  <List dense>
                    {["Draft", "In Review", "Approved", "Done", "Archived"].map(
                      (status, idx) => (
                        <ListItem
                          key={status}
                          secondaryAction={
                            <>
                              <IconButton edge="end" color="primary">
                                <EditIcon />
                              </IconButton>
                              <IconButton edge="end" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </>
                          }
                        >
                          <ListItemText primary={status} />
                        </ListItem>
                      )
                    )}
                  </List>
                  <Button variant="text" sx={{ mt: 1 }}>
                    + Thêm trạng thái
                  </Button>
                </Box>

                {/* Right: Roles & thêm luồng */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    ROLES
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}
                  >
                    {["PM", "ADMIN", "TEST", "DEV", "USER", "BA"].map(
                      (role) => (
                        <FormControlLabel
                          key={role}
                          control={<Checkbox />}
                          label={role}
                        />
                      )
                    )}
                  </Box>
                  <TextField
                    label="Từ trạng thái"
                    fullWidth
                    margin="dense"
                    defaultValue="Draft"
                  />
                  <TextField
                    label="Đến trạng thái"
                    fullWidth
                    margin="dense"
                    defaultValue="InReview"
                  />
                  <Button variant="contained" sx={{ mt: 2 }}>
                    Thêm luồng
                  </Button>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      - <b>InReview → Approved (PM)</b>{" "}
                      <Button size="small">Edit</Button>
                      <Button size="small" color="error">
                        Delete
                      </Button>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </>
          )}

          {/* Tab 1: Quản lý vai trò */}
          {tabIndex === 1 && (
            <>
              <Typography
                variant="h6"
                gutterBottom
                style={{
                  marginTop: "30px",
                }}
              >
                <InputLabel style={{ marginBottom: "10px" }}>ROLES</InputLabel>
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel id="role-select-label">Chọn Vai Trò</InputLabel>
                    <Select
                      labelId="role-select-label"
                      id="role-select"
                      multiple
                      value={selectedRoles}
                      onChange={handleRoleChange}
                      label="Chọn Vai Trò"
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {["PM", "ADMIN", "TEST", "DEV", "USER", "BA"].map(
                        (role) => (
                          <MenuItem key={role} value={role}>
                            <Checkbox
                              checked={selectedRoles.indexOf(role) > -1}
                            />
                            <ListItemText primary={role} />
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <TextField
                  label="Tìm kiếm..."
                  size="small"
                  sx={{ width: "60%" }}
                />
                <Box>
                  {/* Nút mở/đóng Form ma trận + Icon Xóa */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={toggleMatrix}
                    >
                      Chức năng
                    </Button>
                  </Box>

                  {/* Collapse chứa bảng Table ma trận quyền */}
                  <Collapse in={showMatrix} unmountOnExit>
                    <Box
                      mt={2}
                      p={2}
                      border="1px dashed gray"
                      borderRadius="8px"
                    >
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox" />
                              <TableCell>
                                <strong>Roles</strong>
                              </TableCell>
                              {PERMISSIONS.map((perm) => (
                                <TableCell key={perm} align="center">
                                  <strong>{perm}</strong>
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tableData.map(({ role, permissions }) => (
                              <TableRow key={role}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selectedRoles.includes(role)}
                                    onChange={() => handleSelectRole(role)}
                                  />
                                </TableCell>
                                <TableCell>{role}</TableCell>
                                {PERMISSIONS.map((perm) => (
                                  <TableCell key={perm} align="center">
                                    {permissions[perm] ? "✅" : ""}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Collapse>
                </Box>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 89, mb: 2 }}
              >
                <Button variant="contained">+ Thêm người</Button>
                <IconButton
                  onClick={handleDeleteSelectedUsers}
                  color="error"
                  disabled={selected.length === 0}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isAllSelected}
                          indeterminate={isIndeterminate}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>STT</TableCell>
                      <TableCell>Tên người dùng</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.includes(user.id)}
                            onChange={() => handleSelectOne(user.id)}
                          />
                        </TableCell>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            DELETE
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  component="div"
                  count={users.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>

              {/* Dialog hiển thị ma trận quyền */}
              <Dialog
                open={openPermissionMatrix}
                onClose={handleCloseMatrix}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>
                  Ma trận quyền - {selected.length} người dùng
                </DialogTitle>
                <DialogContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Áp dụng cho:
                  </Typography>
                  <ul>
                    {users
                      .filter((u) => selected.includes(u.id))
                      .map((u) => (
                        <li key={u.id}>{u.name}</li>
                      ))}
                  </ul>
                  {/* Form ma trận quyền ở đây */}
                  <p>[Form ma trận quyền sẽ được hiển thị tại đây]</p>
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleCloseMatrix}>Đóng</Button>
                  <Button variant="contained">Lưu</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>

        {/* Close button (top-right corner) */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSettingPopover;
