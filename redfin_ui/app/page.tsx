// page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { NewsCard } from "./components/NewsCard";
import { FeaturedAINewsSection } from "./components/FeaturedAINewsSection";
import { LLMRecommendationSection } from "./components/LLMRecommendationSection";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SignupPage } from "./components/SignupPage";
import { LoginPage } from "./components/LoginPage";
import { NewsDetailPage } from "./components/NewsDetailPage";
import { ProfileEditPage } from "./components/ProfileEditPage";
import { InterestsSettingsPage } from "./components/InterestsSettingsPage";
import { Skeleton } from "./components/ui/skeleton";
import { NaverAllNewsSection } from "./components/NaverAllNewsSection";
import { NaverSearchResults } from "./components/NaverSearchResults";

// --- 타입 정의 ---
type RawNews = {
  source?: string | null;
  title?: string | null;
  link: string;
  published?: string | null;
  summary?: string | null;
  authors?: string[] | null;
  tags?: string[] | null;
};

type NewsNormalized = {
  id: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  imageUrl: string;
  sourceUrl: string;
  source: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  detailAddress?: string;
  bio?: string;
};

type PageType = "home" | "login" | "signup" | "newsDetail" | "profileEdit" | "interests";

// --- 상수 정의 ---
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://192.168.0.123:8000";
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1523742810063-4f61a38b7e1b?w=1200&q=80&auto=format&fit=crop";
const categoryLabels: Record<string, string> = {
  all: "전체",
  politics: "정치",
  economy: "경제",
  society: "사회",
  culture: "문화",
  international: "국제",
  sports: "스포츠",
  technology: "기술",
};

// --- API 호출 및 데이터 정규화 함수 ---
async function fetchNews(): Promise<RawNews[]> {
  const res = await fetch(`${API_BASE}/news?limit=24`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch /news");
  return res.json();
}

function normalizeNews(raw: RawNews[]): NewsNormalized[] {
  return raw.map((n) => ({
    id: n.link,
    title: n.title ?? "(제목 없음)",
    description: n.summary ?? "",
    category: n.tags?.[0] ?? "technology",
    publishedAt: n.published ?? "",
    imageUrl: PLACEHOLDER_IMG,
    sourceUrl: n.link,
    source: n.source ?? "Unknown",
  }));
}

// --- 메인 컴포넌트 ---
export default function App() {
  // --- 상태 관리 (State) ---
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [selectedNewsId, setSelectedNewsId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [news, setNews] = useState<NewsNormalized[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // --- 부수 효과 (Effects) ---
  useEffect(() => {
    let alive = true;

    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data from sessionStorage", e);
        sessionStorage.removeItem('user');
      }
    }

    (async () => {
      try {
        setIsLoading(true);
        const raw = await fetchNews();
        if (alive) setNews(normalizeNews(raw));
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  // --- 메모이제이션 (Memoization) ---
  const featuredNews = useMemo(() => {
    if (!news.length) return [] as typeof news;

    const keywords = [
      'ai', '인공지능', '머신러닝', '딥러닝', 'chatgpt', '오픈ai', 'openai',
      'llm', '생성형', 'copilot', '코파일럿', 'gpt', 'claude', 'gemini'
    ];
    const containsAI = (text: string) => {
      const t = (text || '').toLowerCase();
      return keywords.some((k) => t.includes(k));
    };
    const getTime = (d: string) => {
      const t = Date.parse(d);
      return isNaN(t) ? 0 : t;
    };

    const aiCandidates = news.filter(
      (n) => containsAI(n.title) || containsAI(n.description) || containsAI(n.category)
    );

    const sorted = [...aiCandidates].sort((a, b) => getTime(b.publishedAt) - getTime(a.publishedAt));
    const top3 = sorted.slice(0, 3);

    if (top3.length < 3) {
      const fallback = news.filter((n) => !top3.includes(n)).slice(0, 3 - top3.length);
      return [...top3, ...fallback];
    }
    return top3;
  }, [news]);

  const filteredNews = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return news.filter((n) => {
      const matchesSearch = n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "all" || n.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [news, searchQuery, selectedCategory]);

  // --- 이벤트 핸들러 ---
  const handleRefresh = () => { /* ... */ };
  const handleSignupClick = () => setCurrentPage("signup");
  const handleLoginClick = () => setCurrentPage("login");
  const handleBackToHome = () => setCurrentPage("home");
  const handleNewsClick = (newsId: string) => {
    setSelectedNewsId(newsId);
    setCurrentPage("newsDetail");
  };
  
  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    alert("로그아웃 되었습니다.");
  };

  const handleProfileClick = () => {
    if (user) {
      setCurrentPage("profileEdit");
    } else {
      alert("로그인이 필요합니다.");
      handleLoginClick();
    }
  };

  const handleInterestsClick = () => {
    if (user) {
      setCurrentPage("interests");
    } else {
      alert("로그인이 필요합니다.");
      handleLoginClick();
    }
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    setCurrentPage("home");
  };

  // --- 조건부 렌더링 ---
  if (currentPage === "newsDetail") {
    return <NewsDetailPage newsId={selectedNewsId} onBack={handleBackToHome} />;
  }
  if (currentPage === "signup") {
    return <SignupPage onBack={handleBackToHome} onSignupSuccess={handleLoginClick} />;
  }
  if (currentPage === "login") {
    return <LoginPage onBack={handleBackToHome} onLoginSuccess={handleLoginSuccess} onSignupClick={handleSignupClick} />;
  }
  if (currentPage === "profileEdit" && user) {
    return <ProfileEditPage user={user} onBack={handleBackToHome} onUpdateProfile={handleUpdateProfile} />;
  }
  if (currentPage === "interests" && user) {
    return <InterestsSettingsPage user={user} onBack={handleBackToHome} />;
  }

  // --- 메인 UI 렌더링 ---
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        user={user}
        onLogout={handleLogout}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onProfileClick={handleProfileClick}
        onInterestsClick={handleInterestsClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* 검색어가 있으면 검색 결과만 표시, 없으면 기본 섹션들 표시 */}
      {searchQuery.trim() ? (
        <NaverSearchResults
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onNewsClick={(url) => window.open(url, '_blank')}
        />
      ) : (
        <>
          <FeaturedAINewsSection />

          <LLMRecommendationSection onNewsClick={handleNewsClick} />

          <NaverAllNewsSection />
        </>
      )}

      <Footer />
    </div>
  );
}
