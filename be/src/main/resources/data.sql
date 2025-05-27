
-- Users
INSERT INTO users (login_id, password, nick_name, profile_image_url)
VALUES
    ('admin@example.com', 'hashed-password-1', '관리자', 'https://dummy.local/profile/admin.png'),
    ('user1@example.com', 'hashed-password-2', '홍길동', 'https://dummy.local/profile/user1.png');

-- Milestones
INSERT INTO milestones (name, description, end_date, is_open, last_modified_at, processing_rate)
VALUES
    ('v1.0', '1차 출시', '2025-06-30 00:00:00', 1, NOW(), 0),
    ('v2.0', '2차 기능 개선', '2025-09-30 00:00:00', 1, NOW(), 0);

-- Labels
INSERT INTO labels (name, description, color, created_at)
VALUES
    ('bug', '버그 수정 필요', '#FF0000', NOW()),
    ('feature', '새 기능 제안', '#00FF00', NOW()),
    ('refactor', '리팩토링 필요', '#0000FF', NOW());

-- Issues
INSERT INTO issues (title, content, author_id, milestone_id, is_open, last_modified_at, image_url)
VALUES
    ('로그인 버튼이 작동하지 않음', '로그인 버튼을 눌러도 반응이 없습니다.', 1, 1, 1, NOW(), null),
    ('회원가입 시 이메일 중복 오류', '중복된 이메일 오류 메시지가 보이지 않습니다.', 2, 2, 1, NOW(), null);

-- Issue_Label
INSERT INTO issue_label (issue_id, label_id, last_modified_at)
VALUES
    (1, 1, NOW()),
    (2, 2, NOW());

-- Issue_Assignee
INSERT INTO issue_assignee (issue_id, assignee_id, last_modified_at)
VALUES
    (1, 2, NOW()),
    (2, 1, NOW());

-- Comments
INSERT INTO comments (issue_id, content, author_id, last_modified_at, image_url)
VALUES
    (1, '이 문제는 곧 해결될 예정입니다.', 2, NOW(), null),
    (2, '재현 가능한 시나리오를 알려주세요.', 1, NOW(), null);
