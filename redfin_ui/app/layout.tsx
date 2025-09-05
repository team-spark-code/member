// app/layout.tsx
// layout.tsx
// 전체 앱의 공통 레이아웃과 메타데이터를 정의하는 Next.js 루트 레이아웃 파일
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "./components/theme-provider";

export const metadata: Metadata = {
  title: "RedFin – AI News",
  description: "AI RSS 뉴스 피드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
