'use client';

// FeaturedNewsCard.tsx
// 🔹 CardHeader, CardTitle, CardDescription, CardFooter 임포트 추가
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, ExternalLink, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FeaturedNewsCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  imageUrl: string;
  sourceUrl: string;
  source: string;
  onClick?: (id: string) => void;
}

export function FeaturedNewsCard({
  id,
  title,
  description,
  category,
  publishedAt,
  imageUrl,
  sourceUrl,
  source,
  onClick
}: FeaturedNewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    // 🔹 NewsCard와 동일하게 flex-col 구조 적용
    <Card 
      className="group flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer min-w-80 bg-gradient-to-br from-card to-card/80 border-2 hover:border-primary/20"
      onClick={handleClick}
    >
      {/* 이미지 영역 */}
      <div className="aspect-[16/10] relative overflow-hidden rounded-t-lg">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-lg flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {category}
        </Badge>
      </div>

      {/* 🔹 CardHeader를 사용하여 제목과 설명 그룹화 */}
      <CardHeader className="pb-2 flex-grow">
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-sm">
          {description}
        </CardDescription>
      </CardHeader>

      {/* 🔹 CardFooter를 사용하여 메타데이터 그룹화 */}
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{formatDate(publishedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{source}</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
