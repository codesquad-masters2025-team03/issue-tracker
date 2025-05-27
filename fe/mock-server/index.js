import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// 인증 미들웨어
const validTokens = ['test-token-123', 'sampleToken123']; // 실제 프로젝트에서는 DB 기반 검증 사용
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '인증 토큰이 없습니다.' });
  }
  const token = authHeader.split(' ')[1];
  if (!validTokens.includes(token)) {
    return res.status(403).json({ success: false, message: '유효하지 않은 토큰입니다.' });
  }
  next();
}

app.get('/', authMiddleware, async (req, res) => {
  try {
    const { author, label, milestone, assignee, page = 1, limit = 10 } = req.query;

    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    let issues = json.issues;

    // 필터링
    if (author) {
      issues = issues.filter((i) => String(i.author.id) === String(author));
    }

    if (label) {
      issues = issues.filter((i) => i.labels?.some((l) => String(l.labelId) === String(label)));
    }

    if (milestone) {
      issues = issues.filter((i) => String(i.milestone?.milestoneId) === String(milestone));
    }

    if (assignee) {
      issues = issues.filter((i) => i.assignees?.some((a) => String(a.id) === String(assignee)));
    }
    if (req.query.isOpen !== undefined) {
      const isOpen = req.query.isOpen === 'true';
      issues = issues.filter((i) => i.isOpen === isOpen);
    }

    // 페이지네이션
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const totalCount = issues.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedIssues = issues.slice(startIndex, startIndex + limitNum);

    // Create a filtered list of issues that ignore isOpen filter
    const baseFilteredIssues = json.issues.filter((i) => {
      if (author && String(i.author.id) !== String(author)) return false;
      if (label && !i.labels?.some((l) => String(l.labelId) === String(label))) return false;
      if (milestone && String(i.milestone?.milestoneId) !== String(milestone)) return false;
      if (assignee && !i.assignees?.some((a) => String(a.id) === String(assignee))) return false;
      return true;
    });

    // Then use that to compute open/close issue numbers
    res.json({
      success: true,
      message: '요청에 성공했습니다.',
      data: {
        issues: paginatedIssues,
        users: json.users,
        labels: json.labels,
        milestones: json.milestones,
        metaData: {
          currentPage: pageNum,
          openIssueNumber: baseFilteredIssues.filter((i) => i.isOpen === true).length,
          closeIssueNumber: baseFilteredIssues.filter((i) => i.isOpen === false).length,
        },
      },
    });
  } catch (error) {
    console.error('🔥 서버 오류:', error.message);
    res.status(500).json({
      success: false,
      message: '서버 내부 오류 발생',
      error: error.message,
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { loginId, password } = req.body;
    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const user = json.users.find((u) => u.nickname === loginId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '존재하지 않는 회원입니다.',
      });
    }

    // 목 환경에서는 모든 사용자의 패스워드를 '1234'로 고정
    if (password !== '1234') {
      return res.status(401).json({
        success: false,
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    // JWT-like access token payload
    const payload = {
      sub: user.id,
      loginId: user.id,
      imgUrl: user.imgUrl,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const accessToken = `header.${base64Payload}.signature`;
    const refreshToken = `refresh.header.${base64Payload}.signature`;

    validTokens.push(accessToken);

    res.json({
      success: true,
      message: '로그인을 성공했습니다.',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    console.error('🔥 로그인 오류:', err.message);
    res.status(500).json({
      success: false,
      message: '서버 오류',
      error: err.message,
    });
  }
});

app.patch('/toggleStatus', async (req, res) => {
  try {
    const { id: ids } = req.body; // id 배열을 받음
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'id 필드는 배열이어야 합니다.' });
    }

    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    let updatedCount = 0;
    const updatedIssues = json.issues.map((issue) => {
      if (ids.includes(issue.id)) {
        updatedCount++;
        return { ...issue, isOpen: !issue.isOpen };
      }
      return issue;
    });

    const updatedJson = { ...json, issues: updatedIssues };
    await fs.writeFile(filePath, JSON.stringify(updatedJson, null, 2), 'utf-8');

    res.json({
      success: true,
      message: `${updatedCount}개의 이슈 상태가 변경되었습니다.`,
    });
  } catch (error) {
    console.error('🔥 PATCH 오류:', error.message);
    res.status(500).json({
      success: false,
      message: '이슈 상태 변경 중 서버 오류 발생',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Mock server running at http://localhost:${PORT}`);
});
