import { BASE_URL } from '.';

export const LABELS_URL = `${BASE_URL}/labels`;

export const GET_LABELS = `${BASE_URL}/labels`;
export const POST_LABEL = `${BASE_URL}/labels`;
export const PATCH_LABEL = (id) => `${BASE_URL}/labels/${id}`;
export const DELETE_LABEL = (id) => `${BASE_URL}/labels/${id}`;
