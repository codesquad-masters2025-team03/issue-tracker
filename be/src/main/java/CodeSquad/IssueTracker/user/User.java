package CodeSquad.IssueTracker.user;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("users")
@Builder
public class User {
    @Id
    private Long id;
    private String loginId; //이메일 형태로 주입받기
    private String password;
    private String nickName;
    private String profileImageUrl;

    public User(Long id, String loginId, String password, String nickName, String profileImageUrl) {
        this.id = id;
        this.loginId = loginId;
        this.password = password;
        this.nickName = nickName;
        this.profileImageUrl = profileImageUrl;
    }

    public User() {

    }


}
