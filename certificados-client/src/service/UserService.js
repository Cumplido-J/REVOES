import UserApi from "../api/UserApi";

import Alerts from "../shared/alerts";

export default {
  userSearch: async (values) => {
    const response = await UserApi.userSearch(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getUserData: async (username) => {
    const response = await UserApi.getUserData(username);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addUser: async (form) => {
    const response = await UserApi.addUser(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editUser: async (username, form) => {
    const response = await UserApi.editUser(username, form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editUserPassword: async (username, form) => {
    const response = await UserApi.editUserPassword(username, form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addGroup: async (form) => {
    const response = await UserApi.addGroup(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getGroupData: async (id) => {
    const response = await UserApi.getGroupData(id);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  updateGroup: async (form) => {
    const response = await UserApi.updateGroup(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteGroup: async (form) => {
    const response = await UserApi.deleteGroup(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addPermission: async (form) => {
    const response = await UserApi.addPermission(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getPermissionData: async (id) => {
    const response = await UserApi.getPermissionData(id);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  updatePermission: async (form) => {
    const response = await UserApi.updatePermission(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deletePermission: async (form) => {
    const response = await UserApi.deletePermission(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getfindByPermissionNotAssignedToGroup: async (id) => {
    const response = await UserApi.getfindByPermissionNotAssignedToGroup(id);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addPermissionTheGroup: async (form) => {
    const response = await UserApi.addPermissionTheGroup(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  removePermissionTheGroup: async (form) => {
    const response = await UserApi.removePermissionTheGroup(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  findByPermissionOfGroup: async (id) => {
    const response = await UserApi.findByPermissionOfGroup(id);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  SuggestionGroupAndPermiissionData: async (data) => {
    const response = await UserApi.SuggestionGroupAndPermiissionData(data);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAllScope: async () => {
    const response = await UserApi.getAllScope();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAllScopeDetailByIdUserScope: async (id) => {
    const response = await UserApi.getAllScopeDetailByIdUserScope(id);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAllScopeDescription: async () => {
    const response = await UserApi.getAllScopeDescription();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAllScopeDetail: async () => {
    const response = await UserApi.getAllScopeDetail();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addNewCatScope: async (form) => {
    const response = await UserApi.addNewCatScope(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editCatScope: async (form) => {
    const response = await UserApi.editCatScope(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getByIdCatScope: async (id) => {
    const response = await UserApi.getByIdCatScope(id);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteCatScope: async (form) => {
    const response = await UserApi.deleteCatScope(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addNewScope: async (form) => {
    const response = await UserApi.addNewScope(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getByIdScope: async (id) => {
    const response = await UserApi.getByIdScope(id);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  updateScope: async (form) => {
    const response = await UserApi.updateScope(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteScope: async (form) => {
    const response = await UserApi.deleteScope(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  findByPermissionNotAssignedToScope: async (id) => {
    const response = await UserApi.findByPermissionNotAssignedToScope(id);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addPermissionTheScope: async (form) => {
    const response = await UserApi.addPermissionTheScope(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  removePermissionTheScope: async (form) => {
    const response = await UserApi.removePermissionTheScope(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
};
