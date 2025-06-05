package CodeSquad.IssueTracker.milestone.dto;

import CodeSquad.IssueTracker.milestone.Milestone;
import lombok.Data;

@Data
public class MilestoneResponse {
    private Long milestoneId;
    private String name;
    private String description; // 프론트에서 필요 없다면 제거 가능
    private String endDate; // ISO 8601 문자열로 포맷 (예: "2025-05-16")
    private Long processingRate; // 0~100 값
    private int openIssue;
    private int closeIssue;
    private Boolean isOpen;

    public static MilestoneResponse convertMilestoneResponse(Milestone milestone){
        MilestoneResponse res = new MilestoneResponse();
        res.setMilestoneId(milestone.getMilestoneId());
        res.setName(milestone.getName());
        res.setDescription(milestone.getDescription());
        res.setEndDate(milestone.getEndDate().toString());
        res.setProcessingRate(milestone.getProcessingRate());
        res.setIsOpen(milestone.getIsOpen());
        return res;
    }
}
