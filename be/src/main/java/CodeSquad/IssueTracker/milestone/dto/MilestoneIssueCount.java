package CodeSquad.IssueTracker.milestone.dto;

public class MilestoneIssueCount {
    private final int openCount;
    private final int closedCount;

    public MilestoneIssueCount(int openCount, int closedCount) {
        this.openCount = openCount;
        this.closedCount = closedCount;
    }

    public int getOpenCount() {
        return openCount;
    }

    public int getClosedCount() {
        return closedCount;
    }
}

