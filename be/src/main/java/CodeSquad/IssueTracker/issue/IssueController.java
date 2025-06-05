package CodeSquad.IssueTracker.issue;

import CodeSquad.IssueTracker.global.dto.BaseResponseDto;
import CodeSquad.IssueTracker.issue.dto.IssueCreateRequest;
import CodeSquad.IssueTracker.issue.dto.IssueDetailResponse;
import CodeSquad.IssueTracker.issue.dto.IssueUpdateDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static CodeSquad.IssueTracker.global.message.SuccessMessage.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/issues")
public class IssueController {

    private final IssueService issueService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponseDto<IssueDetailResponse> createIssue(
            @RequestPart("data") @Validated IssueCreateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            HttpServletRequest httpRequest
    ) throws IOException {
        String loginId = httpRequest.getAttribute("loginId").toString();
        log.info("Creating new issue with login id {}", loginId);
        return BaseResponseDto.success(ISSUE_CREATE_SUCCESS.getMessage(), issueService.createIssue(request,files,loginId));
    }


    @GetMapping("/{issueId}")
    public BaseResponseDto<IssueDetailResponse> getIssueDetailInfo(@PathVariable Long issueId) {
        Issue issue = issueService.findById(issueId);
        return BaseResponseDto.success(ISSUE_DETAIL_FETCH_SUCCESS.getMessage(), issueService.toDetailResponse(issue));
    }

    @PatchMapping("/{issueId}")
    public BaseResponseDto<IssueDetailResponse> updateIssue(@PathVariable Long issueId,
                                           @RequestPart("data") IssueUpdateDto updateParam,
                                           @RequestPart(value = "files",required = false) List<MultipartFile> files) throws IOException {
        return BaseResponseDto.success(ISSUE_UPDATE_SUCCESS, issueService.update(issueId, updateParam, files));
    }

    @DeleteMapping("/{issueId}")
    public BaseResponseDto<String> deleteIssue(@PathVariable Long issueId) {
        issueService.deleteIssue(issueId);
        return BaseResponseDto.success(ISSUE_DELETE_SUCCESS.getMessage(), null);
    }

}
