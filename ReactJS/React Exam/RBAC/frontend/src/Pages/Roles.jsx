import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  Table,
  Checkbox,
  Typography,
  message,
  Alert,
  Tag,
  Spin,
  Input,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/slice/authSlice";

const { Title, Text } = Typography;
const BASE_URL = "http://localhost:3001";

const MODULES = ["users", "employees", "projects", "roles"];
const ACTIONS = ["view", "add", "edit", "delete"];

const Roles = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const currentUserRef = useRef(currentUser);
  const perms = currentUser?.permissions?.roles || [];

  const canView = perms.includes("view");
  const canEdit = perms.includes("edit");

  const [roles, setRoles]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/roles`);
      const data = await res.json();
      setRoles(data);

      const user = currentUserRef.current;
      if (user) {
        const freshRole = data.find((r) => r.role_id === user.role_id);
        if (freshRole) {
          const currentPerms = JSON.stringify(user.permissions || {});
          const freshPerms = JSON.stringify(freshRole.permissions || {});
          if (currentPerms !== freshPerms) {
            const updatedUser = { ...user, permissions: freshRole.permissions };
            dispatch(setUser(updatedUser));
            localStorage.setItem("rbac_user", JSON.stringify(updatedUser));
          }
        }
      }
    } catch {
      message.error("Failed to load roles");
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (canView) {
      loadRoles();
    }
  }, [canView, loadRoles]);

  const handlePermissionToggle = async (roleId, module, action, checked) => {
    if (!canEdit) return;

    setSaving(true);
    try {
      const role = roles.find((r) => r.role_id === roleId);
      const currentPerms = [...(role.permissions[module] || [])];

      let updatedPerms;
      if (checked) {
        updatedPerms = [...currentPerms, action];
        if ((action === "edit" || action === "delete") && !updatedPerms.includes("view")) {
          updatedPerms = [...updatedPerms, "view"];
        }
      } else {
        if (action === "view") {
          updatedPerms = [];
        } else {
          updatedPerms = currentPerms.filter((p) => p !== action);
        }
      }

      const updatedPermissions = {
        ...role.permissions,
        [module]: updatedPerms,
      };

     
         // Optimistic UI update
      setRoles((prev) =>
        prev.map((r) =>
          r.role_id === roleId ? { ...r, permissions: updatedPermissions } : r
        )
      );
      if (currentUser && currentUser.role_id === roleId) {
        const optimisticUser = { ...currentUser, permissions: updatedPermissions };
        dispatch(setUser(optimisticUser));
        localStorage.setItem("rbac_user", JSON.stringify(optimisticUser));
      }

      const res = await fetch(`${BASE_URL}/roles/${role.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...role, permissions: updatedPermissions }),
      });
      if (!res.ok) throw new Error("Failed to update");
      message.success("Permission updated!");

    } catch {
      message.error("Failed to update permission");
      // Re-sync from DB if optimistic update failed
      loadRoles();
    }
    setSaving(false);
  };

  const roleFilters = useMemo(() => {
    const uniqueRoles = [...new Set(roles.map((r) => r.role))];
    return uniqueRoles.map((role) => ({ text: role, value: role }));
  }, [roles]);

  const filteredData = useMemo(() => {
    if (!searchText) return roles;
    return roles.filter((role) =>
      role.role?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [roles, searchText]);

  useEffect(() => {
    setPagination((p) => ({ ...p, current: 1 }));
  }, [searchText]);

  if (!canView) {
    return <Alert message="You don't have permission to view roles." type="error" />;
  }

  if (loading) {
    return (
      <div className="my-[50px] text-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Roles & Permissions</Title>

      <div className="mb-4">
        <Input
          placeholder="Search by role name"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-[250px]"
          allowClear
        />
      </div>

      {!canEdit && (
        <Alert
          message="View Only Mode - Only Admin can modify permissions."
          type="info"
          showIcon
          className="mb-4"
        />
      )}

      {canEdit && saving && (
        <Alert message="Saving changes..." type="warning" className="mb-4" />
      )}

      <Table
        dataSource={filteredData}
        rowKey="role_id"
        onChange={(pager) => setPagination((p) => ({ ...p, current: pager.current || 1 }))}
        pagination={{
          current: pagination.current,
          pageSize: 10,
          total: filteredData.length,
          showSizeChanger: false,
        }}
        bordered
        columns={[
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
            filters: roleFilters,
            filterMode: "menu",
            filterSearch: true,
            onFilter: (value, record) => record.role === value,
            render: (role) => (
              <Tag
                color={{ Admin: "red", HR: "blue", Supervisor: "orange", Manager: "green" }[role]}
              >
                {role}
              </Tag>
            ),
            width: 120,
          },
          ...MODULES.map((module) => ({
            title: module.charAt(0).toUpperCase() + module.slice(1),
            key: module,
            align: "center",
            render: (_, record) => {
              const modulePerms = record.permissions[module] || [];
              return (
                <div className="flex flex-col gap-1">
                  {ACTIONS.map((action) => {
                    const hasPermission = modulePerms.includes(action);
                    return (
                      <Checkbox
                        key={`${module}-${action}`}
                        checked={hasPermission}
                        disabled={!canEdit || record.role === "Admin"}
                        onChange={(e) =>
                          handlePermissionToggle(record.role_id, module, action, e.target.checked)
                        }
                      >
                        <Text className="!text-xs">{action}</Text>
                      </Checkbox>
                    );
                  })}
                </div>
              );
            },
          })),
        ]}
      />
    </div>
  );
};

export default Roles;

