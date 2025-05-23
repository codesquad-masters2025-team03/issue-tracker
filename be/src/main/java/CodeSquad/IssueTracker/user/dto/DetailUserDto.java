package CodeSquad.IssueTracker.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetailUserDto {
    private Long id;
    private String nickName;
    private String profileImageUrl;
}
