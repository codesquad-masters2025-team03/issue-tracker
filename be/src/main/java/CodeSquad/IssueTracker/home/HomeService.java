package CodeSquad.IssueTracker.home;

import CodeSquad.IssueTracker.home.dto.IssueFilterRequestDto;
import CodeSquad.IssueTracker.home.dto.HomeResponseDto;
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

    public HomeResponseDto getHomeData(IssueFilterRequestDto filterRequestDto) {
        return new HomeResponseDto(
                issueService.findIssuesByFilter(filterRequestDto),
                userService.findAllUserDetails(),
                labelService.findAll(),
                milestoneService.findAll()
        );
    }
}
