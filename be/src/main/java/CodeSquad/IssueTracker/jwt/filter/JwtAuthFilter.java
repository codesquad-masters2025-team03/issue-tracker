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
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter implements Filter {

    private final JWTUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;

        String requestURI = httpRequest.getRequestURI();
        String contextPath = httpRequest.getContextPath();
        String method = httpRequest.getMethod();


        log.info("[JWT Filter] 💣 진입 | URI=[{}] | Context=[{}] | Method=[{}]", requestURI, contextPath, method);

        // ✅ OPTIONS 요청 우회
        if ("OPTIONS".equalsIgnoreCase(method)) {
            log.info("[JWT Filter] ✅ OPTIONS 요청 우회");
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // ✅ 정적 리소스 및 공개 경로 우회
        if (isPermitAllPath(requestURI)) {
            log.info("[JWT Filter] ✅ 인증 예외 경로 우회: {}", requestURI);
            filterChain.doFilter(httpRequest, httpResponse);
            return;
        }

        // ✅ Authorization 헤더 검사
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("[JWT Filter] ❌ Authorization 헤더 없음 또는 형식 오류 | URI: {}", requestURI);
            writeJsonResponse(httpResponse,
                    BaseResponseDto.failure("Authorization 헤더가 없거나 형식이 잘못되었습니다."),
                    HttpStatus.UNAUTHORIZED);
            return;
        }

        // ✅ 토큰 유효성 검사
        String accessToken = authHeader.substring(7);
        try {
            Claims claims = jwtUtil.validateAccessToken(accessToken);
            httpRequest.setAttribute("id", claims.get("loginId"));
            httpRequest.setAttribute("loginId", claims.get("loginUser"));
            log.info("[JWT Filter] ✅ 유효한 토큰 | loginUser: {}", claims.get("loginUser"));
        } catch (JwtValidationException e) {
            log.warn("[JWT Filter] ❌ JWT 검증 실패 | Reason: {}", e.getMessage());
            writeJsonResponse(httpResponse,
                    BaseResponseDto.failure(e.getMessage()),
                    HttpStatus.UNAUTHORIZED);
            return;
        }

        // ✅ 통과
        filterChain.doFilter(httpRequest, httpResponse);
    }

    private boolean isPermitAllPath(String uri) {
        return uri.equals("/") ||
                uri.equals("/favicon.ico") ||
                uri.equals("/login") ||
                uri.equals("/signup") ||
                uri.endsWith(".html") ||
                uri.endsWith(".js") ||
                uri.endsWith(".css") ||
                uri.endsWith(".svg") ||
                uri.endsWith(".ico") ||
                uri.startsWith("/assets/") ||
                uri.startsWith("/static/") ||
                uri.startsWith("/oauth/callback/github") ||
                uri.startsWith("/oauth-success");

    }

    private void writeJsonResponse(HttpServletResponse response, BaseResponseDto dto, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json; charset=UTF-8");
        String json = new ObjectMapper().writeValueAsString(dto);
        response.getWriter().write(json);
    }
}
