package CodeSquad.IssueTracker.home.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MetaData {
    private final int currentPage;
    private final int maxPage;
    private final int openIssueNumber;
    private final int closeIssueNumber;
}
