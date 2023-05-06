# Front-end

## 프로젝트 구조
- public/ : 리소스 파일들
- src/assets : 내부 리소스
- src/components : 컴포넌트 정의
- src/modules : 기타 함수, 열거형 정의
- src/pages : 각 페이지 정의
- src/plugins : 플러그인 정의(Vuetify)
- src/services : API 통신 wrapper
- src/App.vue : 페이지 최상위 컴포넌트
- src/main.js : 프론트엔드 진입점
- src/router.js : 라우터 정의
- .env : 환경변수 정의 (백엔드 API URI)
- vue.config.js : vue 프레임워크 설정

## .env 설정
- 해당 파일 내 주석 참고

## 개발 모드 실행 및 빌드
### 패키지 설치
```
npm install
```

### 컴파일 및 개발 모드로 실행
```
npm run serve
```
:exclamation: 포트 기본값: 8080

### 컴파일 및 프로젝트 빌드
```
npm run build
```