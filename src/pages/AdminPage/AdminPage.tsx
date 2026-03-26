import {
  EditOutlined,
  FilterOutlined,
  LinkOutlined,
  LockOutlined,
  RestOutlined,
  SearchOutlined,
  TeamOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { AxiosError } from "axios";
import {
  App,
  Button,
  Card,
  Checkbox,
  Empty,
  Flex,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type {
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { selectUsersData } from "../../store/slices/admin/adminSelectors";
import {
  blockUserThunk,
  deleteUserThunk,
  getUsersThunk,
  setUserRolesThunk,
  unblockUserThunk,
} from "../../store/slices/admin/adminSlice";
import { selectProfile } from "../../store/slices/users/usersSelectors";
import type { UserFilters } from "../../types/admin.types";
import type { Profile, Role } from "../../types/auth.types";

const { Title, Text } = Typography;

type SortableField = "username" | "email";
type BlockFilter = "all" | "blocked" | "active";

interface QueryState {
  page: number;
  limit: number;
  sortBy?: SortableField;
  sortOrder?: "asc" | "desc";
  search?: string;
  isBlocked?: boolean;
}

const PAGE_SIZE = 20;

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Администратор",
  MODERATOR: "Модератор",
  USER: "Пользователь",
};

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "red",
  MODERATOR: "blue",
  USER: "default",
};

const BLOCK_FILTER_LABELS: Record<BlockFilter, string> = {
  all: "Все пользователи",
  blocked: "Только заблокированные",
  active: "Только активные",
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Не удалось выполнить действие";
};

const toAntSortOrder = (order?: "asc" | "desc") => {
  if (order === "asc") return "ascend";
  if (order === "desc") return "descend";
  return undefined;
};

const getBlockedFilterValue = (filter: BlockFilter) => {
  if (filter === "all") return undefined;
  return filter === "blocked";
};

export default function AdminPage() {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    data: users,
    status: { isLoading: isUsersLoading },
  } = useAppSelector(selectUsersData);
  const {
    data: currentProfile,
    status: { isLoadedOrError: isCurrentProfileReady, isLoadingOrIdle },
  } = useAppSelector(selectProfile);

  const isAdmin = currentProfile?.roles.includes("ADMIN") ?? false;
  const canManageUsers =
    isAdmin || (currentProfile?.roles.includes("MODERATOR") ?? false);
  const canBlockUsers = canManageUsers;

  const [queryState, setQueryState] = useState<QueryState>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [searchInput, setSearchInput] = useState("");
  const [blockFilter, setBlockFilter] = useState<BlockFilter>("all");
  const [pendingBlockUserId, setPendingBlockUserId] = useState<number | null>(
    null,
  );
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<number | null>(
    null,
  );
  const [editingRolesUser, setEditingRolesUser] = useState<Profile | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [isRolesSaving, setIsRolesSaving] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQueryState((prev) => ({
        ...prev,
        search: searchInput.trim() || undefined,
        page: 1,
      }));
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  useEffect(() => {
    setQueryState((prev) => ({
      ...prev,
      isBlocked: getBlockedFilterValue(blockFilter),
      page: 1,
    }));
  }, [blockFilter]);

  useEffect(() => {
    if (isCurrentProfileReady && !canManageUsers) {
      navigate("/", { replace: true });
    }
  }, [isCurrentProfileReady, canManageUsers, navigate]);

  const usersFilters: UserFilters = useMemo(
    () => ({
      search: queryState.search,
      sortBy: queryState.sortBy,
      sortOrder: queryState.sortOrder,
      isBlocked: queryState.isBlocked,
      limit: queryState.limit,
      page: Math.max(0, queryState.page - 1),
    }),
    [queryState],
  );

  const refreshUsers = useCallback(async () => {
    await dispatch(getUsersThunk(usersFilters)).unwrap();
  }, [dispatch, usersFilters]);

  useEffect(() => {
    if (!canManageUsers) return;
    refreshUsers().catch(() => undefined);
  }, [canManageUsers, refreshUsers]);

  useEffect(() => {
    const total = users?.meta.totalAmount ?? 0;
    const maxPage = Math.max(1, Math.ceil(total / queryState.limit));
    if (queryState.page > maxPage) {
      setQueryState((prev) => ({ ...prev, page: maxPage }));
    }
  }, [users?.meta.totalAmount, queryState.limit, queryState.page]);

  const handleTableChange: TableProps<Profile>["onChange"] = (
    pagination: TablePaginationConfig,
    _,
    sorter: SorterResult<Profile> | SorterResult<Profile>[],
  ) => {
    const normalizedSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    const rawField = normalizedSorter?.field;
    const sortBy =
      rawField === "username" || rawField === "email" ? rawField : undefined;
    const sortOrder =
      normalizedSorter?.order === "ascend"
        ? "asc"
        : normalizedSorter?.order === "descend"
          ? "desc"
          : undefined;

    setQueryState((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      limit: pagination.pageSize ?? prev.limit,
      sortBy,
      sortOrder,
    }));
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setBlockFilter("all");
    setQueryState((prev) => ({
      ...prev,
      page: 1,
      sortBy: undefined,
      sortOrder: undefined,
      search: undefined,
      isBlocked: undefined,
    }));
  };

  const handleBlockToggle = async (user: Profile) => {
    try {
      setPendingBlockUserId(user.id);
      if (user.isBlocked) {
        await dispatch(unblockUserThunk(user.id)).unwrap();
        message.success("Пользователь разблокирован");
      } else {
        await dispatch(blockUserThunk(user.id)).unwrap();
        message.success("Пользователь заблокирован");
      }
      await refreshUsers();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setPendingBlockUserId(null);
    }
  };

  const handleDelete = async (user: Profile) => {
    try {
      setPendingDeleteUserId(user.id);
      await dispatch(deleteUserThunk(user.id)).unwrap();
      message.success("Пользователь удалён");

      const isLastUserOnPage = (users?.data.length ?? 0) === 1;
      if (isLastUserOnPage && queryState.page > 1) {
        setQueryState((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        await refreshUsers();
      }
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setPendingDeleteUserId(null);
    }
  };

  const openRolesModal = (user: Profile) => {
    setEditingRolesUser(user);
    setSelectedRoles(user.roles);
  };

  const handleSaveRoles = async () => {
    if (!editingRolesUser) return;
    try {
      setIsRolesSaving(true);
      await dispatch(
        setUserRolesThunk({ id: editingRolesUser.id, roles: selectedRoles }),
      ).unwrap();
      message.success("Роли обновлены");
      setEditingRolesUser(null);
      await refreshUsers();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setIsRolesSaving(false);
    }
  };

  const columns: ColumnsType<Profile> = [
    {
      title: "Профиль",
      key: "profile",
      render: (_, user) => (
        <Button
          type="link"
          icon={<LinkOutlined />}
          onClick={() => navigate(`/users/${user.id}`)}
          title="Перейти к профилю"
        />
      ),
    },
    {
      title: "Имя пользователя",
      dataIndex: "username",
      key: "username",
      sorter: true,
      sortOrder:
        queryState.sortBy === "username"
          ? toAntSortOrder(queryState.sortOrder)
          : undefined,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      sortOrder:
        queryState.sortBy === "email"
          ? toAntSortOrder(queryState.sortOrder)
          : undefined,
    },
    {
      title: "Дата регистрации",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString("ru-RU"),
    },
    {
      title: "Статус блокировки",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked: boolean) =>
        isBlocked ? (
          <Tag color="red">Заблокирован</Tag>
        ) : (
          <Tag color="green">Активен</Tag>
        ),
    },
    {
      title: "Роли",
      dataIndex: "roles",
      key: "roles",
      render: (roles: Role[], user) => (
        <Flex gap={8} align="center" wrap>
          {roles.map((role) => (
            <Tag key={role} color={ROLE_COLORS[role]}>
              {ROLE_LABELS[role]}
            </Tag>
          ))}
          {isAdmin ? (
            <Tooltip title="Изменить роли">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => openRolesModal(user)}
              />
            </Tooltip>
          ) : null}
        </Flex>
      ),
    },
    {
      title: "Телефон",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber?: string) => phoneNumber || "—",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, user) => (
        <Space.Compact size="middle">
          {canBlockUsers ? (
            user.isBlocked && !isAdmin ? null : (
              <Popconfirm
                title={
                  user.isBlocked
                    ? "Разблокировать пользователя?"
                    : "Заблокировать пользователя?"
                }
                okText="Подтвердить"
                cancelText="Отмена"
                onConfirm={() => handleBlockToggle(user)}
              >
                <Button
                  title={user.isBlocked ? "Разблокировать" : "Заблокировать"}
                  icon={user.isBlocked ? <UnlockOutlined /> : <LockOutlined />}
                  danger={!user.isBlocked}
                  loading={pendingBlockUserId === user.id}
                />
              </Popconfirm>
            )
          ) : null}

          {isAdmin ? (
            <Popconfirm
              title="Удалить пользователя?"
              description="Действие нельзя отменить."
              okText="Удалить"
              okButtonProps={{ danger: true }}
              cancelText="Отмена"
              onConfirm={() => handleDelete(user)}
            >
              <Button
                title="Удалить"
                icon={<RestOutlined />}
                danger
                loading={pendingDeleteUserId === user.id}
              />
            </Popconfirm>
          ) : null}
        </Space.Compact>
      ),
    },
  ];

  if (isLoadingOrIdle) {
    return <Spin size="large" spinning />;
  }

  const hasActiveFilters =
    Boolean(searchInput.trim()) ||
    blockFilter !== "all" ||
    Boolean(queryState.sortBy && queryState.sortOrder);

  return (
    <Spin size="large" spinning={isUsersLoading}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Flex align="center" gap={16} wrap>
            <TeamOutlined style={{ fontSize: 42 }} />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                Пользователи
              </Title>
              <Text type="secondary">
                Управление пользователями, ролями и доступом
              </Text>
            </div>
            <Space style={{ marginLeft: "auto" }} wrap>
              <Tag>Найдено: {users?.meta.totalAmount ?? 0}</Tag>
              <Tag color="processing">{BLOCK_FILTER_LABELS[blockFilter]}</Tag>
            </Space>
          </Flex>
        </Card>

        <Card
          title="Таблица пользователей"
          extra={
            hasActiveFilters ? (
              <Button onClick={handleResetFilters}>Сбросить фильтры</Button>
            ) : null
          }
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex gap={12} wrap>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                value={searchInput}
                placeholder="Поиск по имени или email"
                onChange={(event) => setSearchInput(event.target.value)}
                style={{ width: 340 }}
              />

              <Select<BlockFilter>
                value={blockFilter}
                onChange={setBlockFilter}
                style={{ width: 300 }}
                suffixIcon={<FilterOutlined />}
                options={[
                  { value: "all", label: "Все пользователи" },
                  { value: "blocked", label: "Только заблокированные" },
                  { value: "active", label: "Только активные" },
                ]}
              />
            </Flex>

            <Table<Profile>
              rowKey="id"
              bordered
              columns={columns}
              dataSource={users?.data ?? []}
              loading={isUsersLoading}
              onChange={handleTableChange}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Пользователи не найдены"
                  />
                ),
              }}
              pagination={{
                current: queryState.page,
                pageSize: queryState.limit,
                total: users?.meta.totalAmount ?? 0,
                showSizeChanger: false,
                hideOnSinglePage: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} из ${total}`,
              }}
              size="middle"
              scroll={{ x: "max-content" }}
            />
          </Space>
        </Card>
      </Space>

      <Modal
        title={
          editingRolesUser
            ? `Роли пользователя ${editingRolesUser.username}`
            : "Роли пользователя"
        }
        open={Boolean(editingRolesUser)}
        onCancel={() => setEditingRolesUser(null)}
        onOk={handleSaveRoles}
        okText="Сохранить"
        cancelText="Отмена"
        confirmLoading={isRolesSaving}
        destroyOnClose
      >
        <Checkbox.Group
          value={selectedRoles}
          onChange={(value) => setSelectedRoles(value as Role[])}
          options={[
            { value: "USER", label: ROLE_LABELS.USER },
            { value: "MODERATOR", label: ROLE_LABELS.MODERATOR },
            { value: "ADMIN", label: ROLE_LABELS.ADMIN },
          ]}
        />
      </Modal>
    </Spin>
  );
}
