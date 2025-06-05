import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fsSync from 'fs';

const app = express();
const PORT = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 파일 업로드 경로 설정
const uploadDir = path.join(__dirname, 'uploads');
if (!fsSync.existsSync(uploadDir)) fsSync.mkdirSync(uploadDir);

// multer 설정 (files key)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 중복 방지: timestamp+원본이름
    const uniqueSuffix =
      Date.now() + '-' + Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage, limits: { fileSize: 30 * 1024 * 1024 }, preservePath: true }); // 30MB 제한

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use((req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('application/json')) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

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

// 기본 응답 구조
const createResponse = (success, message, data) => ({
  success,
  message,
  data,
});

app.post(
  '/issues',
  upload.fields([{ name: 'files' }, { name: 'data' }]),
  authMiddleware,
  async (req, res) => {
    try {
      let data;
      try {
        const jsonBuffer = req.files?.data?.[0]?.buffer;
        if (!jsonBuffer) throw new Error('data 필드 누락');
        data = JSON.parse(jsonBuffer.toString('utf-8'));
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'data 필드는 JSON 형식이어야 합니다.',
          error: err.message,
        });
      }

      // 파일 처리
      let fileUrl = null;
      if (req.files?.files?.[0]) {
        fileUrl = `http://localhost:${PORT}/uploads/${req.files.files[0].filename}`;
      }

      const filePath = path.join(__dirname, 'mainPage.json');
      const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      // 새 이슈 ID 생성
      const newIssueId = Math.max(...json.issues.map((i) => i.id)) + 1;

      // 새 이슈 객체 생성
      const newIssue = {
        issue: {
          issueId: newIssueId,
          title: data.title,
          content: data.content,
          authorId: 1, // 현재 로그인한 사용자 ID
          milestoneId: data.milestoneId,
          isOpen: true,
          lastModifiedAt: new Date().toISOString(),
          issueFileUrl: fileUrl,
        },
        assignees: (data.assigneeIds || [])
          .map((id) => {
            const user = json.users.find((u) => u.id === id);
            return user
              ? {
                  id: user.id,
                  nickName: user.nickName,
                  profileImageUrl:
                    user.profileImageUrl || `https://dummy.local/profile/${user.nickName}.png`,
                }
              : null;
          })
          .filter(Boolean),
        labels: (data.labelIds || [])
          .map((id) => {
            const label = json.labels.find((l) => l.labelId === id);
            return label
              ? {
                  labelId: label.labelId,
                  name: label.name,
                  color: label.color,
                }
              : null;
          })
          .filter(Boolean),
        milestone: data.milestoneId
          ? {
              ...json.milestones.find((m) => m.id === data.milestoneId),
              milestoneId: data.milestoneId,
              processingRate: 0,
            }
          : null,
        comments: [],
      };

      // 새 이슈를 기존 이슈 목록에 추가
      json.issues.push({
        id: newIssueId,
        title: data.title,
        content: data.content,
        isOpen: true,
        author: json.users.find((u) => u.id === 1),
        assignees: newIssue.assignees,
        labels: newIssue.labels,
        milestone: newIssue.milestone,
        createdAt: new Date().toISOString(),
        issueFileUrl: fileUrl,
        comments: [],
      });

      // 파일 저장
      await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');

      res.status(201).json(
        createResponse(true, '새 이슈가 생성되었습니다.', {
          issue: {
            issueId: newIssueId,
          },
        }),
      );
    } catch (error) {
      console.error('🔥 이슈 생성 오류:', error.message);
      res.status(500).json(
        createResponse(false, '이슈 생성 중 서버 오류 발생', {
          error: error.message,
        }),
      );
    }
  },
);
app.use('/uploads', express.static(uploadDir));

app.get('/home', authMiddleware, async (req, res) => {
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
    const totalCount = issues?.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedIssues = issues.slice(startIndex, startIndex + limitNum);
    // id → issueId 변환 (응답 전용)
    const formattedIssues = paginatedIssues.map(({ id, ...rest }) => ({
      issueId: id,
      ...rest,
    }));

    // Create a filtered list of issues that ignore isOpen filter
    const baseFilteredIssues = json.issues.filter((i) => {
      if (author && String(i.author.id) !== String(author)) return false;
      if (label && !i.labels?.some((l) => String(l.labelId) === String(label))) return false;
      if (milestone && String(i.milestone?.milestoneId) !== String(milestone)) return false;
      if (assignee && !i.assignees?.some((a) => String(a.id) === String(assignee))) return false;
      return true;
    });

    // Then use that to compute open/close issue numbers
    res.json(
      createResponse(true, '요청에 성공했습니다.', {
        issues: formattedIssues,
        users: json.users,
        labels: json.labels,
        milestones: json.milestones,
        metaData: {
          currentPage: pageNum,
          openIssueNumber: baseFilteredIssues.filter((i) => i.isOpen === true)?.length,
          closeIssueNumber: baseFilteredIssues.filter((i) => i.isOpen === false)?.length,
          maxPage: totalPages,
        },
      }),
    );
  } catch (error) {
    console.error('🔥 서버 오류:', error.message);
    res.status(500).json(
      createResponse(false, '서버 내부 오류 발생', {
        error: error.message,
      }),
    );
  }
});

app.post('/login', async (req, res) => {
  try {
    const { loginId, password } = req.body;
    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const user = json.users.find((u) => u.nickName === loginId);
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
      profileImageUrl: user.profileImageUrl,
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

app.patch('/toggleStatus', upload.none(), async (req, res) => {
  try {
    let ids = [];
    if (req.body.data) {
      try {
        const parsed = JSON.parse(req.body.data);
        ids = parsed.id;
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'data 필드는 JSON 형식이어야 합니다.',
          error: err.message,
        });
      }
    } else {
      ids = req.body.id;
    }

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

// 코멘트 수정
app.patch('/issues/:issueId/comments/:commentId', upload.single('files'), async (req, res) => {
  try {
    const { issueId, commentId } = req.params;
    let data = {};
    if (req.body.data) {
      try {
        data = JSON.parse(req.body.data);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'data 필드는 JSON 형식이어야 합니다.',
          error: err.message,
        });
      }
    }

    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const issue = json.issues.find((issue) => issue.id === Number(issueId));
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: '이슈를 찾을 수 없습니다.',
      });
    }

    const comment = issue.comments?.find((comment) => comment.commentId === Number(commentId));
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '코멘트를 찾을 수 없습니다.',
      });
    }

    // 파일 URL 처리 (없으면 기존 URL 유지)
    let fileUrl = comment.issueFileUrl || null;
    if (req.file) {
      fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    // 코멘트 내용/파일 업데이트
    if (data.content !== undefined) {
      comment.content = data.content;
    }
    comment.issueFileUrl = fileUrl;
    comment.lastModifiedAt = new Date().toISOString();

    // 파일에 변경사항 저장
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');

    res.json({
      success: true,
      message: '코멘트가 성공적으로 수정되었습니다.',
      data: {
        comment: comment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '코멘트 수정 중 서버 오류 발생',
      error: error.message,
    });
  }
});

// 코멘트 생성 (FormData: data(JSON), files)
app.post('/issues/:issueId/comments', upload.single('files'), async (req, res) => {
  try {
    let data;
    try {
      data = JSON.parse(req.body.data);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'data 필드는 JSON 형식이어야 합니다.',
        error: err.message,
      });
    }
    const { issueId } = req.params;

    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    const issue = json.issues.find((issue) => issue.id === Number(issueId));
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: '이슈를 찾을 수 없습니다.',
      });
    }

    // 새 코멘트 ID 생성
    const newCommentId =
      Math.max(
        ...json.issues.flatMap(
          (issue) => issue.comments?.map((comment) => comment.commentId) || [0],
        ),
      ) + 1;

    // 파일 URL 처리
    let fileUrl = null;
    if (req.file) {
      fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    // 새 코멘트 객체 생성
    const newComment = {
      commentId: newCommentId,
      content: data.content,
      issueFileUrl: fileUrl,
      authorNickname: 'devchan', // 현재는 고정값 사용
      lastModifiedAt: new Date().toISOString(),
    };

    // 이슈의 comments 배열이 없으면 생성
    if (!issue.comments) {
      issue.comments = [];
    }

    // 새 코멘트 추가
    issue.comments.push(newComment);

    // 파일에 변경사항 저장
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');

    res.status(201).json({
      success: true,
      message: '코멘트가 성공적으로 생성되었습니다.',
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '코멘트 생성 중 서버 오류 발생',
      error: error.message,
    });
  }
});

// PATCH /issues/:id - 이슈 수정
app.patch(
  '/issues/:id',
  upload.fields([{ name: 'files' }, { name: 'data' }]),
  authMiddleware,
  async (req, res) => {
    try {
      const issueId = parseInt(req.params.id);
      const filePath = path.join(__dirname, 'mainPage.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const json = JSON.parse(data);

      const issueIndex = json.issues.findIndex((issue) => issue.id === issueId);
      // --- DEBUGGING BLOCK START ---
      console.log('--- DEBUG: PATCH /issues/:id ---');
      console.log('req.body:', req.body);
      console.log('req.files:', req.files);
      if (req.files?.data?.[0]) {
        console.log('data buffer:', req.files.data[0].buffer?.toString('utf-8'));
      }
      // --- DEBUGGING BLOCK END ---
      if (issueIndex === -1) {
        return res.status(404).json({
          success: false,
          message: '이슈를 찾을 수 없습니다.',
        });
      }

      // 🔽 멀티파트에서 data 필드를 JSON으로 파싱 (buffer 또는 텍스트 기반)
      let updateData = {};
      try {
        if (req.files?.data?.[0]?.buffer) {
          updateData = JSON.parse(req.files.data[0].buffer.toString('utf-8'));
        } else if (req.body?.data) {
          updateData = JSON.parse(req.body.data);
        } else {
          throw new Error('data 필드 누락');
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'data 필드는 JSON 형식이어야 합니다.',
          error: err.message,
        });
      }

      let issue = json.issues[issueIndex];

      // 파일 처리
      if (req.files?.files?.[0]) {
        const fileUrl = `http://localhost:${PORT}/uploads/${req.files.files[0].filename}`;
        issue.issueFileUrl = fileUrl;
      }

      // 업데이트 할 필드들 반영
      Object.keys(updateData).forEach((key) => {
        if (key === 'assigneeId' && Array.isArray(updateData.assigneeId)) {
          issue.assignees = updateData.assigneeId
            .map((id) => json.users.find((user) => user.id === id))
            .filter(Boolean);
        } else if (key === 'labelId' && Array.isArray(updateData.labelId)) {
          issue.labels = updateData.labelId
            .map((id) => {
              const label = json.labels.find((l) => l.labelId === id);
              return label
                ? {
                    labelId: label.labelId,
                    name: label.name,
                    color: label.color,
                    description: label.description || '',
                  }
                : null;
            })
            .filter(Boolean);
        } else if (key === 'milestoneId') {
          const milestone = json.milestones.find((m) => m.milestoneId === updateData.milestoneId);
          issue.milestone = milestone || null;
        } else if (key === 'isOpen') {
          // Accept isOpen from multipart/form-data (string or boolean)
          issue.isOpen = updateData.isOpen === 'true' || updateData.isOpen === true;
        } else if (key in issue) {
          issue[key] = updateData[key];
        }
      });

      // 갱신된 이슈 저장
      json.issues[issueIndex] = issue;
      await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');

      return res.json({
        success: true,
        message: '이슈가 성공적으로 수정되었습니다.',
        data: {
          issue,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '이슈 수정 중 서버 오류 발생',
        error: error.message,
      });
    }
  },
);

app.get('/issues/:id', authMiddleware, async (req, res) => {
  try {
    const issueId = parseInt(req.params.id);
    const filePath = path.join(__dirname, 'mainPage.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(data);

    const issue = json.issues.find((issue) => issue.id === issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: '이슈를 찾을 수 없습니다.',
        data: null,
      });
    }

    const responseData = {
      success: true,
      message: '이슈를 성공적으로 조회했습니다.',
      data: {
        issue: {
          issueId: issue.id,
          title: issue.title,
          content: issue.content,
          authorId: issue.author.id,
          authorNickname: issue.author.nickName,
          milestoneId: issue.milestone?.milestoneId ?? null,
          isOpen: issue.isOpen,
          lastModifiedAt: issue.lastModifiedAt || issue.createdAt,
          issueFileUrl: issue.issueFileUrl || null,
          authorProfileUrl:
            issue.author.profileImageUrl ||
            `https://dummy.local/profile/${issue.author.nickName}.png`,
        },
        assignees: (issue.assignees || []).map((assignee) => ({
          id: assignee.id,
          nickName: assignee.nickName,
          profileImageUrl:
            assignee.profileImageUrl || `https://dummy.local/profile/${assignee.nickName}.png`,
        })),
        labels: (issue.labels || []).map((label) => ({
          labelId: label.labelId,
          name: label.name,
          color: label.color,
          description: label.description || '',
        })),
        milestone: issue.milestone
          ? {
              milestoneId: issue.milestone.milestoneId,
              name: issue.milestone.name,
              description: issue.milestone.description,
              endDate: issue.milestone.endDate,
              processingRate: issue.milestone.processingRate || 0,
              isOpen: issue.milestone.isOpen,
            }
          : null,
        comments: (issue.comments || []).map((comment) => {
          const user = json.users.find((u) => u.nickName === comment.authorNickname);
          return {
            commentId: comment.commentId,
            content: comment.content,
            issueFileUrl: comment.issueFileUrl || null,
            authorId: user?.id || 1,
            authorNickname: comment.authorNickname,
            lastModifiedAt: comment.lastModifiedAt || comment.createdAt,
            authorProfileUrl:
              comment.authorProfileUrl ||
              `https://dummy.local/profile/${comment.authorNickname}.png`,
          };
        }),
      },
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '이슈 조회 중 서버 오류 발생',
      error: error.message,
    });
  }
});

// PATCH /milestones/:id - 마일스톤 수정
app.patch('/milestones/:id', authMiddleware, async (req, res) => {
  try {
    const milestoneId = parseInt(req.params.id);
    const filePath = path.join(__dirname, 'mainPage.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(data);

    const milestoneIndex = json.milestones.findIndex((m) => m.milestoneId === milestoneId);
    if (milestoneIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '마일스톤을 찾을 수 없습니다.',
        data: null,
      });
    }

    const allowedFields = ['name', 'description', 'endDate', 'isOpen'];
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        json.milestones[milestoneIndex][key] = req.body[key];
      }
    });

    await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');

    res.json({
      success: true,
      message: '마일스톤이 성공적으로 수정되었습니다.',
      data: {
        milestone: json.milestones[milestoneIndex],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '마일스톤 수정 중 서버 오류 발생',
      data: { error: error.message },
    });
  }
});

app.get('/milestones', authMiddleware, async (req, res) => {
  try {
    const { isOpen } = req.query;
    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    let milestones = json.milestones;

    // isOpen 필터링 (응답의 milestones만)
    if (typeof isOpen !== 'undefined') {
      milestones = milestones.filter((m) => String(m.isOpen) === String(isOpen));
    }

    // 각 마일스톤의 open/close 이슈 개수 계산
    const issues = json.issues;
    const milestonesWithIssueCounts = milestones.map((m) => {
      const openIssue = issues.filter(
        (issue) => issue.milestone?.milestoneId === m.milestoneId && issue.isOpen === true,
      )?.length;
      const closeIssue = issues.filter(
        (issue) => issue.milestone?.milestoneId === m.milestoneId && issue.isOpen === false,
      )?.length;
      return { ...m, openIssue, closeIssue };
    });

    // 마일스톤 개수 카운트 (isOpen 필터링 전, 전체)
    const allMilestones = json.milestones;
    const openCount = allMilestones.filter((m) => m.isOpen === true)?.length;
    const closedCount = allMilestones.filter((m) => m.isOpen === false)?.length;

    res.json({
      success: true,
      message: '마일스톤 목록 조회 성공',
      data: {
        milestones: milestonesWithIssueCounts,
        openCount,
        closedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '마일스톤 목록 조회 중 서버 오류 발생',
      data: { error: error.message },
    });
  }
});

// POST /milestones - 마일스톤 생성
app.post('/milestones', authMiddleware, async (req, res) => {
  try {
    const { name, description = '', endDate = '', isOpen = true } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '마일스톤 이름은 필수입니다.',
        data: null,
      });
    }

    const filePath = path.join(__dirname, 'mainPage.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(data);

    // 새 마일스톤 ID 생성
    const newMilestoneId = Math.max(0, ...json.milestones.map((m) => m.milestoneId || m.id)) + 1;

    const newMilestone = {
      milestoneId: newMilestoneId,
      name,
      description,
      endDate,
      isOpen,
      processingRate: 0,
    };

    json.milestones.unshift(newMilestone);
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');

    res.status(201).json({
      success: true,
      message: '새 마일스톤이 성공적으로 생성되었습니다.',
      data: { milestone: newMilestone },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '마일스톤 생성 중 서버 오류 발생',
      data: { error: error.message },
    });
  }
});

// ----- LABELS API -----

// GET /labels - 전체 레이블 목록 조회
app.get('/labels', authMiddleware, async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    // mainPage.json의 labels 배열 사용
    res.json(
      createResponse(true, '성공메세지', {
        labels: json.labels || [],
        count: (json.labels || []).length,
      }),
    );
  } catch (error) {
    res.status(500).json(createResponse(false, '레이블 조회 오류', { error: error.message }));
  }
});

// POST /labels - 레이블 생성
app.post('/labels', authMiddleware, async (req, res) => {
  try {
    const { name, description = '', color = '#CCCCCC' } = req.body;
    if (!name || !color) {
      return res.status(400).json(createResponse(false, 'name, color는 필수입니다.', null));
    }

    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    // 새 레이블 id 부여 (labelId)
    const newLabelId = Math.max(0, ...(json.labels || []).map((l) => l.labelId || l.id)) + 1;
    const newLabel = {
      labelId: newLabelId,
      name,
      description,
      color,
    };
    json.labels = [newLabel, ...(json.labels || [])];
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');
    res.status(201).json(
      createResponse(true, '성공적으로 생성되었습니다.', {
        label: newLabel,
      }),
    );
  } catch (error) {
    res.status(500).json(createResponse(false, '레이블 생성 오류', { error: error.message }));
  }
});

// PATCH /labels/:id - 레이블 수정
app.patch('/labels/:id', authMiddleware, async (req, res) => {
  try {
    const labelId = parseInt(req.params.id);
    const { name, description = '', color } = req.body;
    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const idx = (json.labels || []).findIndex((l) => Number(l.labelId) === labelId);
    if (idx === -1) {
      return res.status(404).json(createResponse(false, '해당 레이블 없음', null));
    }
    // 변경 사항만 반영
    if (name) json.labels[idx].name = name;
    if (description !== undefined) json.labels[idx].description = description;
    if (color) json.labels[idx].color = color;
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');
    res.json(
      createResponse(true, '성공적으로 수정되었습니다.', {
        label: json.labels[idx],
      }),
    );
  } catch (error) {
    res.status(500).json(createResponse(false, '레이블 수정 오류', { error: error.message }));
  }
});

// DELETE /labels/:id - 레이블 삭제
app.delete('/labels/:id', authMiddleware, async (req, res) => {
  try {
    const labelId = parseInt(req.params.id);
    const filePath = path.join(__dirname, 'mainPage.json');
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const beforeLen = (json.labels || []).length;
    json.labels = (json.labels || []).filter((l) => Number(l.labelId) !== labelId);
    // 이슈에서 해당 레이블도 제거
    json.issues = (json.issues || []).map((issue) => ({
      ...issue,
      labels: (issue.labels || []).filter((l) => Number(l.labelId) !== labelId),
    }));
    if (json.labels.length === beforeLen) {
      return res.status(404).json(createResponse(false, '해당 레이블 없음', null));
    }
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');
    res.json(createResponse(true, '레이블이 삭제되었습니다.', null));
  } catch (error) {
    res.status(500).json(createResponse(false, '레이블 삭제 오류', { error: error.message }));
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Mock server running at http://localhost:${PORT}`);
});
