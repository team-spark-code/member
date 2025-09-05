"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Link as LinkIcon } from "lucide-react";

type NewsItem = {
  title: string;
  source: string;
  category: string;
  time: string;
  link?: string;
};

interface RealtimeNewsTickerProps {
  refreshMs?: number; // API 폴링 주기
  rotateMs?: number;  // 문구 회전 주기
  className?: string;
}

export default function RealtimeNewsTicker({ refreshMs = 60000, rotateMs = 4000, className = "" }: RealtimeNewsTickerProps) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rotateRef = useRef<number | null>(null);
  const pollRef = useRef<number | null>(null);

  const current = useMemo(() => (items.length ? items[index % items.length] : null), [items, index]);

  const fetchNews = async () => {
    try {
      setError(null);
      const res = await fetch("/api/naver/realtime-keywords", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data?.data?.length) {
        setItems(data.data as NewsItem[]);
      } else if (data?.data?.length) {
        setItems(data.data as NewsItem[]);
      } else {
        setError("데이터가 없습니다.");
      }
    } catch (e) {
      setError("가져오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // 폴링
    pollRef.current = window.setInterval(fetchNews, refreshMs);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [refreshMs]);

  useEffect(() => {
    if (!items.length) return;
    // 회전 타이머
    rotateRef.current = window.setInterval(() => setIndex((i) => (i + 1) % items.length), rotateMs);
    return () => {
      if (rotateRef.current) window.clearInterval(rotateRef.current);
    };
  }, [items, rotateMs]);

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <span className="inline-flex items-center gap-1 text-primary font-medium">
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        실시간
      </span>
      <div className="relative min-w-[200px] max-w-[50vw] overflow-hidden">
        {loading ? (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" /> 불러오는 중...
          </span>
        ) : error ? (
          <span className="text-muted-foreground">{error}</span>
        ) : current ? (
          <a
            href={current.link || "#"}
            target={current.link ? "_blank" : undefined}
            rel={current.link ? "noreferrer" : undefined}
            className="block whitespace-nowrap transition-opacity duration-500 hover:text-foreground text-ellipsis overflow-hidden"
            title={current.title}
          >
            {current.title}
            {current.link ? <LinkIcon className="inline w-3 h-3 ml-1 align-middle opacity-60" /> : null}
          </a>
        ) : (
          <span className="text-muted-foreground">표시할 뉴스가 없습니다.</span>
        )}
      </div>
      {current && (
        <span className="text-xs text-muted-foreground hidden sm:inline">{current.time}</span>
      )}
    </div>
  );
}

