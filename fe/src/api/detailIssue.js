import { BASE_URL } from '.';

const defaultAPI = `${BASE_URL}/issues`;

export function getDetailIssueAPI(issueId) {
  return `${defaultAPI}/${issueId}`;
}
export function patchDetailIssueAPI(issueId) {
  return `${defaultAPI}/${issueId}`;
}

export function postCommentInDetailIssueAPI(issueId) {
  return `${defaultAPI}/${issueId}/comments`;
}
export function patchCommentInDetailIssueAPI(issueId, commentId) {
  return `${defaultAPI}/${issueId}/comments/${commentId}`;
}

export function deleteDetailIssueAPI(id) {
  return `${defaultAPI}/${id}`;
}
