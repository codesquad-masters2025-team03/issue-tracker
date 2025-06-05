package CodeSquad.IssueTracker.issue;

import CodeSquad.IssueTracker.issue.dto.IssueStatusUpdateRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

@ExtendWith(MockitoExtension.class)
public class issueServiceTest {

    @Mock
    IssueRepository issueRepository;

    @InjectMocks
    IssueService issueService;

    @BeforeEach
    void setup() {

    }

    @Test
    @DisplayName("다중 이슈 ID (1, 2, 3)의 상태를 '닫힘'으로 변경한다")
    void updateIssueStatusTest() {
        // given
        IssueStatusUpdateRequest condition = new IssueStatusUpdateRequest(List.of(1L, 2L, 3L), false);

        // when
        issueService.updateIssueOpenState(condition);

        // then
        Mockito.verify(issueRepository).updateIsOpen(condition);
    }
}
