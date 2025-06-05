import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import PrivateRoute from './PrivateRoute';
import MainLayout from '@/pages/MainLayout';
import IssueListPage from '@/pages/IssueListPage';
import NewIssuePage from '@/pages/NewIssuePage';
import LabelPage from '@/pages/LabelPage';
import MilestonePage from '@/pages/MilestonePage';
import IssueDetailPage from '@/pages/IssueDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import OAuthSuccess from '@/pages/OAuthSuccess';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인/회원가입은 레이아웃 없이 단독 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* 로그인된 유저만 접근 가능한 경로 */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<IssueListPage />} />
            <Route path="issue/new" element={<NewIssuePage />} />
            <Route path="issue/labels" element={<LabelPage />} />
            <Route path="issue/milestones" element={<MilestonePage />} />
            <Route path="issue/:id" element={<IssueDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
