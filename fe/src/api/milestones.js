import { BASE_URL } from '.';

export const GET_MILESTONE = `${BASE_URL}/milestones`;
export const POST_MILESTONE = `${BASE_URL}/milestones`;
export const getPatchUrl = (milestoneId) => {
  const PATCH_MILESTONE = `${BASE_URL}/milestones/${milestoneId}`;
  return PATCH_MILESTONE;
};

export const DELETE_MILESTONE = (id) => `${BASE_URL}/milestones/${id}`;
