# Member RSS Demo 프로젝트

이 프로젝트는 Spring Boot, JPA, Elasticsearch를 활용한 회원 관리 및 검색 데모 애플리케이션입니다.

## 주요 기능
- 회원 가입, 로그인, 프로필 관리
- 회원 조건 검색(이름, 사용자명, 이메일, 전화번호 등)
- Elasticsearch 기반 고속 검색 및 JPA fallback
- 회원 관심사 관리

## 폴더 구조
```
demo/
 ├── src/
 │   ├── main/
 │   │   ├── java/com/example/demo/
 │   │   │   ├── controller/         # REST API 컨트롤러
 │   │   │   ├── domain/             # 엔티티 클래스
 │   │   │   ├── dto/                # DTO 클래스
 │   │   │   ├── repository/
 │   │   │   │   ├── jpa/            # JPA 리포지토리
 │   │   │   │   └── elasticsearch/  # Elasticsearch 리포지토리
 │   │   │   └── service/            # 서비스 로직
 │   │   └── resources/              # 설정 파일
 │   └── test/                       # 테스트 코드
 ├── build.gradle                    # Gradle 빌드 파일
 └── README.md                       # 프로젝트 설명
```

## 실행 방법
1. **Elasticsearch 실행**
   - `elasticsearch-8.10.4` 폴더의 실행 파일로 Elasticsearch를 먼저 실행하세요.
   - D:\member_rss0825\elasticsearch-8.10.4\bin\elasticsearch.bat

2. **Spring Boot 애플리케이션 실행**
   - `demo` 폴더에서 `./gradlew bootRun` 또는 IDE에서 실행
3. **API 테스트**
   - Postman, curl 등으로 회원 가입/검색/로그인 등 API 호출

## 주요 의존성
- Spring Boot
- Spring Data JPA
- Spring Data Elasticsearch
- Spring Security
- Lombok

## 참고
- Elasticsearch가 동작하지 않을 경우 JPA 기반 검색으로 자동 fallback 됩니다.
- 회원 조건검색 시 전체 회원이 반환되지 않고, 검색 결과가 없으면 빈 결과를 반환합니다.

---
문의: 담당자에게 연락 바랍니다.
