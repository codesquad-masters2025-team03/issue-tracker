import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.get('/', async (req, res) => {
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
      issues = issues.filter((i) => i.labels?.some((l) => String(l.id) === String(label)));
    }

    if (milestone) {
      issues = issues.filter((i) => String(i.milestone?.id) === String(milestone));
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

    // 응답
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
          openIssueNumber: issues.filter((i) => i.isOpen === true).length,
          closeIssueNumber: issues.filter((i) => i.isOpen === false).length,
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

app.listen(PORT, () => {
  console.log(`🟢 Mock server running at http://localhost:${PORT}`);
});
