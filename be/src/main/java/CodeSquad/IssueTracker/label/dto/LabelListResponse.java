package CodeSquad.IssueTracker.label.dto;

import lombok.Data;

import java.util.List;

@Data
public class LabelListResponse {
    private int count;
    private List<LabelResponse> labels;

    public LabelListResponse(List<LabelResponse> labels) {
        this.labels = labels;
        this.count = labels.size();
    }
}
