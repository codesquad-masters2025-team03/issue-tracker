package CodeSquad.IssueTracker.user;

import CodeSquad.IssueTracker.user.dto.DetailUserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User save(User user){
        return userRepository.save(user);
    }

    public Optional<User> findByLoginId(String loginId){
        return userRepository.findByLoginId(loginId);
    }

    public Optional<User> findById(Long id){
        return userRepository.findById(id);
    }

    public Iterable<User> findAll(){
        return userRepository.findAll();
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public Iterable<DetailUserDto> findAllUserDetails() {
        return userRepository.findAllUserDetails();
    }
}
