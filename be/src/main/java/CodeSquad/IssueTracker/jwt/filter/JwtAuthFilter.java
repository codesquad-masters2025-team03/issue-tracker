package CodeSquad.IssueTracker.jwt.filter;

import CodeSquad.IssueTracker.global.dto.BaseResponseDto;
import CodeSquad.IssueTracker.jwt.exception.JwtValidationException;
import CodeSquad.IssueTracker.jwt.util.JWTUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Log4j2
public class JwtAuthFilter implements Filter {
    private final JWTUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;

        String requestURI =  httpRequest.getRequestURI();

        // 특정 URL 경로는 필터를 적용하지 않도록 처리
        if (requestURI.equals("/login") || requestURI.equals("/signup") || requestURI.equals("/oauth/callback/github")) {
            filterChain.doFilter(httpRequest, httpResponse);
            return;
        }

        log.info("[JWT Filter] Request URI: {}", requestURI);
        String authHeader = httpRequest.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            BaseResponseDto responseDto = BaseResponseDto.failure("Authorization 헤더가 없거나 형식이 잘못되었습니다.");
            String json = new ObjectMapper().writeValueAsString(responseDto);

            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.setContentType("application/json; charset=UTF-8");
            httpResponse.getWriter().write(json);
            return;
        }

        String accessToken = authHeader.substring(7);

        try {
            Claims claims = jwtUtil.validateAccessToken(accessToken);
            httpRequest.setAttribute("id", claims.get("loginId")); // 사용자의 식별자 id
            httpRequest.setAttribute("loginId", claims.get("loginUser")); // 로그인 시 사용되는 id
            log.info("[JWT Filter] loginId: {}", claims.get("loginUser"));
        } catch (JwtValidationException e) {
            BaseResponseDto responseDto = BaseResponseDto.failure(e.getMessage());
            String json = new ObjectMapper().writeValueAsString(responseDto);

            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.setContentType("application/json; charset=UTF-8");
            httpResponse.getWriter().write(json);
            return;
        }

        filterChain.doFilter(httpRequest, httpResponse);
    }
}
