package CodeSquad.IssueTracker.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SummaryUserDto {
    private Long id;
    private String nickName;
    private String profileImageUrl;
}
