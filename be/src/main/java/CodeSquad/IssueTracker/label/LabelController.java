package CodeSquad.IssueTracker.label;

import CodeSquad.IssueTracker.global.dto.BaseResponseDto;
import CodeSquad.IssueTracker.label.dto.CreateLabelRequest;
import CodeSquad.IssueTracker.label.dto.LabelListResponse;
import CodeSquad.IssueTracker.label.dto.LabelResponse;
import CodeSquad.IssueTracker.label.dto.LabelUpdateDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static CodeSquad.IssueTracker.global.message.SuccessMessage.*;

@Slf4j
@RestController
@RequestMapping("/labels")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;

    @GetMapping
    public BaseResponseDto<LabelListResponse> getLabels() {
        List<Label> labels = labelService.findAll();

        List<LabelResponse> responseList = labels.stream()
                .map(LabelResponseConverter::toLabelResponse)
                .toList();

        return BaseResponseDto.success(LABEL_LIST_FETCH_SUCCESS.getMessage(), new LabelListResponse(responseList));
    }

    @PostMapping
    public BaseResponseDto createLabel(@RequestBody CreateLabelRequest request){
        labelService.save(request.toEntity());
        return BaseResponseDto.success(LABEL_CREATE_SUCCESS.getMessage(), null);
    }

    @PatchMapping(value = "/{labelId}")
    public BaseResponseDto updateLabel(@RequestBody LabelUpdateDto request,@PathVariable Long labelId){
        labelService.update(labelId,request);
        return BaseResponseDto.success(LABEL_UPDATE_SUCCESS.getMessage(), null);
    }

    @DeleteMapping("/{labelId}")
    public BaseResponseDto deleteLabel(@PathVariable Long labelId) {
        labelService.deleteById(labelId);
        return BaseResponseDto.success(LABEL_DELETE_SUCCESS.getMessage(), null);
    }
}
