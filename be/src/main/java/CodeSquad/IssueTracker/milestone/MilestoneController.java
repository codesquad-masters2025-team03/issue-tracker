package CodeSquad.IssueTracker.milestone;

import CodeSquad.IssueTracker.global.dto.BaseResponseDto;
import CodeSquad.IssueTracker.milestone.dto.CreateMilestoneRequest;
import CodeSquad.IssueTracker.milestone.dto.MilestoneListResponse;
import CodeSquad.IssueTracker.milestone.dto.MilestoneUpdateDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import static CodeSquad.IssueTracker.global.message.SuccessMessage.*;

@RestController
@Slf4j
@RequestMapping("/milestones")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;

    @GetMapping
    public BaseResponseDto<MilestoneListResponse> getMilestones(@RequestParam(defaultValue = "true") Boolean isOpen) {
        return BaseResponseDto.success(MILESTONE_LIST_FETCH_SUCCESS.getMessage(), milestoneService.getMilestonesByStatus(isOpen));
    }


    @PostMapping
    public BaseResponseDto createMilestone(@RequestBody CreateMilestoneRequest request) {
        milestoneService.save(request.toEntity());
        return BaseResponseDto.success(MILESTONE_CREATE_SUCCESS, null);
    }


    @PatchMapping("/{milestoneId}")
    public BaseResponseDto updateMilestone(@PathVariable Long milestoneId, @RequestBody MilestoneUpdateDto request){
        milestoneService.update(milestoneId,request);
        return BaseResponseDto.success(MILESTONE_UPDATE_SUCCESS.getMessage(), null);
    }

    @DeleteMapping("/{milestoneId}")
    public BaseResponseDto deleteMileStone(@PathVariable Long milestoneId) {
        milestoneService.deleteById(milestoneId);
        return BaseResponseDto.success(MILESTONE_DELETE_SUCCESS.getMessage(), null);
    }
}
