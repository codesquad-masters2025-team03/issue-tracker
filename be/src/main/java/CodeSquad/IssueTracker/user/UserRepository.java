package CodeSquad.IssueTracker.user;

import CodeSquad.IssueTracker.user.dto.DetailUserDto;

import java.util.List;
import java.util.Optional;

public interface UserRepository {

    User save(User user);

    Optional<User> findByLoginId(String loginId);

    Optional<User> findById(Long id);

    List<User> findAll();

    List<DetailUserDto> findAllUserDetails();

    void deleteById(Long id);
}
