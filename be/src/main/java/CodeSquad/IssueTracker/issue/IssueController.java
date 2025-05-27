package CodeSquad.IssueTracker.issue;

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
import java.util.Enumeration;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/issues")
public class IssueController {

    private final IssueService issueService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public IssueDetailResponse createIssue(
            @RequestPart("data") @Validated IssueCreateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            HttpServletRequest httpRequest
    ) throws IOException {
        log.info("[요청 데이터] title={}, content={}, assignees={}, labels={}, milestone={}",
                request.getTitle(),
                request.getContent(),
                request.getAssigneeIds(),
                request.getLabelIds(),
                request.getMilestoneId());
        log.info("[Multipart form] request content type: {}", httpRequest.getContentType());
        Enumeration<String> partNames = httpRequest.getParameterNames();
        while (partNames.hasMoreElements()) {
            String paramName = partNames.nextElement();
            log.info("요청 파라미터 이름: {}, 값: {}", paramName, httpRequest.getParameter(paramName));
        }
        Object loginIdAttr = httpRequest.getAttribute("loginId");

        if (loginIdAttr == null) {
            log.warn("[loginId 없음] HttpServletRequest에 loginId가 없습니다.");
            throw new IOException("살려주세요"); // 예외 던지거나 401 응답
        }

        String loginId = loginIdAttr.toString();
        log.info("[loginId 확인] loginId: {}", loginId);

        /*String loginId = httpRequest.getAttribute("loginId").toString();*/
        log.info("Creating new issue with login id {}", loginId);
        return issueService.createIssue(request, files, loginId);
    }


    @GetMapping("/{issueId}")
    public IssueDetailResponse getIssueDetailInfo(@PathVariable Long issueId) {
        Issue byIdIssue = issueService.findById(issueId).get();
        return issueService.toDetailResponse(byIdIssue);
    }

    @PatchMapping("{issueId}")
    public void updateIssue(@PathVariable Long issueId, @RequestBody IssueUpdateDto updateParam) {
        issueService.update(issueId, updateParam);
    }


}
