import GroupsApi from "../api/GroupsApi";

import Alerts from "../shared/alerts";

export const getFilteredGroups = async params => {
  const response = await GroupsApi.getFilteredGroups(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getFilteredGroupsPeriod = async params => {
  const response = await GroupsApi.getFilteredGroupsPeriod(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const disableGroupsById = async groupId => {
	const response = await GroupsApi.disableGroupById(groupId); 
	if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
	return response;
}

export const createGroup = async data => {
	const response = await GroupsApi.createGroup(data);
	if(!response.success) Alerts.error("Ha ocurrido un error", response.message);
	return response;
}

export const getGroupDetails = async groupId => {
	const response = await GroupsApi.groupDetails(groupId);
	if(!response.success) Alerts.error("Ha ocurrido un error", response.message);
	return response;
}

export const updateGroup = async (groupId, data) => {
	const response = await GroupsApi.updateGroup(groupId, data);
	if(!response.success) Alerts.error("Ha ocurrido un error", response.message);
	return response;
}

export const setStudentsOnGroup = async (groupId, dataRaw) => {
	const response = await GroupsApi.setStudentsOnGroup(dataRaw, groupId);
	if(!response.success) Alerts.error("Ha ocurrido un error", response.message);
	return response;
}

export const deleteGroupById = async (groupId) => {
	const response = await GroupsApi.deleteGroupById(groupId);
	if(!response.success) Alerts.error("Ha ocurrido un error", response.message);
	return response;
}
