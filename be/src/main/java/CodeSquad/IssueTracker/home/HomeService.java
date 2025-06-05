package CodeSquad.IssueTracker.home;

import CodeSquad.IssueTracker.home.dto.HomeResponseDto;
import CodeSquad.IssueTracker.home.dto.IssueFilterCondition;
import CodeSquad.IssueTracker.home.dto.MetaData;
import CodeSquad.IssueTracker.issue.IssueService;
import CodeSquad.IssueTracker.label.LabelService;
import CodeSquad.IssueTracker.milestone.MilestoneService;
import CodeSquad.IssueTracker.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final IssueService issueService;
    private final LabelService labelService;
    private final MilestoneService milestoneService;
    private final UserService userService;

    public HomeResponseDto getHomeData(int currentPage, IssueFilterCondition condition) {
        int openIssueNumber = issueService.countIssuesByOpenStatus(true, condition);
        int closeIssueNumber = issueService.countIssuesByOpenStatus(false, condition);
        int maxPage = issueService.getIssueMaxPage(condition);

        return new HomeResponseDto(
                issueService.findIssuesByFilter(currentPage, condition),
                userService.findAllUserDetails(),
                labelService.findAll(),
                milestoneService.findAll(),
                new MetaData(currentPage, maxPage, openIssueNumber, closeIssueNumber)
        );
    }
}
