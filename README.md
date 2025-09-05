# Full-Stack News Scraping & Curation Platform

## 1. 프로젝트 개요

이 프로젝트는 사용자가 웹상의 뉴스 기사를 스크랩하고, 이를 개인화된 대시보드에서 관리하며, 다른 사용자와 공유할 수 있는 풀스택 웹 애플리케이션입니다. Spring Boot를 사용한 강력한 백엔드와 React(Next.js) 기반의 동적인 프론트엔드를 결합하여, 현대적이고 반응성이 뛰어난 사용자 경험을 제공합니다.

백엔드는 사용자 인증, 데이터 크롤링, 뉴스 자동 분류 등의 핵심 비즈니스 로직을 처리하며, 프론트엔드는 사용자가 상호작용하는 세련된 UI와 상태 관리를 담당합니다.

---

## 2. 주요 기능

### Backend (Spring Boot)

- **사용자 인증 시스템:**
  - **API 기반 인증:** JSON 웹 토큰(JWT) 대신 세션 기반의 인증을 사용하며, React 클라이언트와의 연동을 위해 커스텀 `JsonUsernamePasswordAuthenticationFilter`를 구현하여 JSON 요청을 처리합니다.
  - **소셜 로그인:** OAuth2 프로토콜을 통해 Google, Kakao 등 소셜 계정으로 간편하게 로그인할 수 있습니다.
  - **보안:** Spring Security를 사용하여 모든 API 엔드포인트와 사용자 비밀번호를 안전하게 보호합니다. (BCrypt 암호화 적용)

- **뉴스 스크랩 및 분석:**
  - **웹 크롤링:** 사용자가 입력한 URL의 웹 페이지를 Jsoup 라이브러리를 사용해 크롤링합니다.
  - **메타데이터 추출:** Open Graph(OG) 태그를 분석하여 뉴스의 제목, 설명, 고해상도 썸네일 이미지, 출처, 발행일 등의 풍부한 정보를 자동으로 추출합니다.
  - **자동 카테고리 분류:** 기사의 제목과 내용에서 핵심 키워드를 분석하여, 해당 뉴스를 '정치', '경제', 'IT/과학' 등 적절한 카테고리로 자동 분류합니다.

- **데이터 관리:**
  - **영구 저장소:** JPA(Hibernate)를 통해 스크랩된 모든 데이터를 MariaDB에 안정적으로 저장합니다.
  - **검색 최적화:** Elasticsearch를 도입하여, 향후 대량의 사용자 또는 뉴스 데이터를 빠르고 유연하게 검색할 수 있는 기반을 마련했습니다.

### Frontend (React / Next.js)

- **현대적인 UI/UX:**
  - **컴포넌트 기반 디자인:** `shadcn/ui`와 `lucide-react` 아이콘을 활용하여 재사용 가능하고 세련된 UI 컴포넌트(뉴스 카드, 헤더, 로그인 폼 등)를 구축했습니다.
  - **반응형 레이아웃:** CSS Grid와 Flexbox를 사용하여 데스크톱, 태블릿, 모바일 등 다양한 화면 크기에서 최적화된 UI를 제공합니다.

- **동적 기능 구현:**
  - **클라이언트 사이드 상태 관리:** React Hooks (`useState`, `useEffect`, `useMemo`)를 사용하여 페이지 상태(로딩, 데이터, UI 모드)를 효율적으로 관리합니다.
  - **실시간 상호작용:** 로그인, 로그아웃, 스크랩 삭제 등의 작업이 페이지 새로고침 없이 즉시 UI에 반영됩니다.
  - **소셜 공유:** 카카오톡 SDK를 연동하여, 사용자가 스크랩한 뉴스를 클릭 한 번으로 지인에게 공유할 수 있습니다.

---

## 3. 기술 스택

| 구분 | 기술 | 설명 |
| --- | --- | --- |
| **Backend** | `Java 17` | 안정성과 생산성을 갖춘 프로그래밍 언어 |
| | `Spring Boot 3.x` | 애플리케이션의 핵심 백엔드 프레임워크 |
| | `Spring Security` | 강력한 인증 및 인가 보안 솔루션 |
| | `Spring Data JPA` | MariaDB와의 데이터 상호작용을 위한 ORM |
| | `Spring Data Elasticsearch`| 검색 기능 최적화를 위한 데이터 연동 |
| | `MariaDB` | 주 데이터베이스 (사용자, 스크랩 정보 저장) |
| | `Jsoup` | 웹 페이지 크롤링 및 HTML 파싱 라이브러리 |
| | `Thymeleaf` | 일부 서버 사이드 렌더링 페이지 구성 |
| **Frontend**| `React (Next.js)` | 사용자 인터페이스 구축을 위한 JavaScript 라이브러리 |
| | `TypeScript` | 코드의 안정성과 가독성을 높이는 정적 타입 시스템 |
| | `Tailwind CSS` | 유틸리티 기반의 CSS 프레임워크 |
| | `shadcn/ui` | 재사용 가능한 UI 컴포넌트 라이브러리 |
| | `Kakao SDK` | 카카오톡 공유 기능 연동 |

---

## 4. 프로젝트 구조

```
member_rss0825/
├── demo/         # Spring Boot 백엔드 애플리케이션
│   └── src/
└── redfin_ui/    # React(Next.js) 프론트엔드 애플리케이션
    └── app/
```

---

## 5. 설치 및 실행 방법

### Backend (Spring Boot)

1.  `demo` 디렉토리로 이동합니다.
2.  `application.properties` 파일에 본인의 MariaDB 및 Elasticsearch 접속 정보를 입력합니다.
3.  Spring Boot 애플리케이션을 실행합니다. (IDE의 실행 버튼 또는 `./gradlew bootRun`)

### Frontend (React)

1.  `redfin_ui` 디렉토리로 이동합니다.
2.  필요한 패키지를 설치합니다:
    ```bash
    npm install
    ```
3.  개발 서버를 시작합니다:
    ```bash
    npm run dev
    ```
4.  브라우저에서 `http://localhost:3000`으로 접속합니다.

**※ 중요:** 카카오톡 공유 기능을 테스트하려면, `redfin_ui/app/components/scrap.html` 파일의 `Kakao.init()` 함수에 **본인의 카카오 JavaScript 키**를 입력하고, 카카오 개발자 사이트의 플랫폼 설정에 **`http://localhost:3000`**을 등록해야 합니다.
