package CodeSquad.IssueTracker.global.message;

import lombok.Getter;

@Getter
public enum SuccessMessage {
    GITHUB_LOGIN_SUCCESS("Github 로그인을 성공했습니다"),
    LOGIN_SUCCESS("로그인을 성공했습니다"),

    ISSUE_LIST_FETCH_SUCCESS("이슈 목록을 성공적으로 불러왔습니다."),
    ISSUE_DETAIL_FETCH_SUCCESS("이슈 상세 정보를 성공적으로 조회했습니다."),
    ISSUE_STATUS_UPDATE_SUCCESS("이슈 상태를 성공적으로 변경했습니다."),
    ISSUE_CREATE_SUCCESS("이슈 생성에 성공했습니다"),
    ISSUE_UPDATE_SUCCESS("이슈 변경에 성공했습니다"),
    ISSUE_DELETE_SUCCESS("이슈 삭제가 정상적으로 치리되었습니다."),

    LABEL_DELETE_SUCCESS("라벨 삭제가 정상적으로 처리되었습니다."),
    LABEL_LIST_FETCH_SUCCESS("라벨 목록을 성공적으로 불러왔습니다."),
    LABEL_CREATE_SUCCESS("라벨 생성에 성공했습니다"),
    LABEL_UPDATE_SUCCESS("라벨 변경에 성공했습니다"),

    MILESTONE_LIST_FETCH_SUCCESS("마일스톤 목록을 성공적으로 불러왔습니다."),
    MILESTONE_CREATE_SUCCESS("마일스톤 생성에 성공했습니다"),
    MILESTONE_UPDATE_SUCCESS("마일스톤 변경에 성공했습니다"),
    MILESTONE_DELETE_SUCCESS("마일스톤 삭제가 정상적으로 처리되었습니다."),

    COMMENT_LIST_FETCH_SUCCESS("코멘트 목록을 성공적으로 불러왔습니다."),
    COMMENT_CREATE_SUCCESS("코멘트 생성에 성공했습니다"),
    COMMENT_UPDATE_SUCCESS("코멘트 변경에 성공했습니다"),
    COMMENT_DELETE_SUCCESS("코멘트 삭제가 정상적으로 처리되었습니다.");

    private final String message;

    SuccessMessage(String message) {
        this.message = message;
    }
}
