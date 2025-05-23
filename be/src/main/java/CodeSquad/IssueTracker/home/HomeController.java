package CodeSquad.IssueTracker.home;

import CodeSquad.IssueTracker.global.dto.BaseResponseDto;
import CodeSquad.IssueTracker.home.dto.IssueFilterRequestDto;
import CodeSquad.IssueTracker.home.dto.HomeResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/")
    public BaseResponseDto<HomeResponseDto> home(@ModelAttribute IssueFilterRequestDto filterRequestDto) {
        return BaseResponseDto.success("이슈목록을 성공적으로 불러왔습니다.",
                homeService.getHomeData(filterRequestDto));
    }
}
