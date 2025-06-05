package CodeSquad.IssueTracker.home;

import CodeSquad.IssueTracker.global.dto.BaseResponseDto;
import CodeSquad.IssueTracker.home.dto.HomeResponseDto;
import CodeSquad.IssueTracker.home.dto.IssueFilterCondition;
import CodeSquad.IssueTracker.issue.IssueService;
import CodeSquad.IssueTracker.issue.dto.IssueStatusUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static CodeSquad.IssueTracker.global.message.SuccessMessage.ISSUE_LIST_FETCH_SUCCESS;
import static CodeSquad.IssueTracker.global.message.SuccessMessage.ISSUE_STATUS_UPDATE_SUCCESS;

@RestController
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;
    private final IssueService issueService;

    @GetMapping("/home")
    public BaseResponseDto<HomeResponseDto> home(@RequestParam(defaultValue = "1") int page, @ModelAttribute IssueFilterCondition condition) {
        return BaseResponseDto.success(ISSUE_LIST_FETCH_SUCCESS.getMessage(),
                homeService.getHomeData(page, condition));
    }

    @PatchMapping("toggleStatus")
    public BaseResponseDto home(@RequestBody IssueStatusUpdateRequest condition) {
        issueService.updateIssueOpenState(condition);
        return BaseResponseDto.success(ISSUE_STATUS_UPDATE_SUCCESS.getMessage(), null);
    }
}
