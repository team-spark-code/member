// Header.tsx
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Newspaper,
  TrendingUp,
  Settings,
  LogOut,
  User,
  UserPlus,
} from "lucide-react";
import { NewsFilters } from "./NewsFilters";
import RealtimeNewsTicker from "./RealtimeNewsTicker";

// 사용자 정보 타입 정의
type User = {
  id: number;
  name: string;
  email: string;
};

// 🔹 Header 컴포넌트의 Props 정의 수정
interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onProfileClick: () => void; // 🔹 프로필 클릭 핸들러 prop 추가
  onInterestsClick: () => void; // 관심사 설정 핸들러 추가
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  onHomeClick?: () => void; // 🔹 홈으로 이동 핸들러 추가 (옵션)
}

export function Header({
  user,
  onLogout,
  onLoginClick,
  onSignupClick,
  onProfileClick, // 🔹 prop 받기
  onInterestsClick, // 관심사 설정 핸들러 받기
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onRefresh,
  isLoading = false,
  onHomeClick,
}: HeaderProps) {
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="flex items-center gap-2 shrink-0 cursor-pointer select-none"
              onClick={onHomeClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onHomeClick?.();
                }
              }}
            >
              <Newspaper className="w-8 h-8 text-primary" />
              <h1>뉴스 크롤러</h1>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
              <TrendingUp className="w-4 h-4" />
              <RealtimeNewsTicker
                className="ml-2 truncate"
                refreshMs={60000}
                rotateMs={4000}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* 직접 로그아웃 버튼 추가 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="hidden sm:flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-2"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left min-w-0">
                        <div className="text-sm font-medium truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* 프로필 메뉴 */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("프로필 클릭됨");
                        onProfileClick();
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>프로필</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("관심사 설정 클릭됨");
                        onInterestsClick();
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>관심사 설정</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* 모바일에서도 보이는 로그아웃 */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("로그아웃 클릭됨");
                        onLogout();
                      }}
                      className="text-destructive sm:hidden"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onLoginClick}>
                  로그인
                </Button>
                <Button onClick={onSignupClick}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  회원가입
                </Button>
              </div>
            )}
          </div>
        </div>

        <NewsFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          onRefresh={onRefresh}
          isLoading={isLoading}
        />
      </div>
    </header>
  );
}
