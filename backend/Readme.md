# Back-end

## 프로젝트 구조
- app/controllers/ : 각 콜렉션에 대한 CRUD 함수 정의
- app/models/ : 각 콜렉션에 대한 모델 정의
- app/modules/ : 모듈 정의(Multer)
- bin/www : 백엔드 서버 진입점
- docs/ : 빌드된 프론트엔드 페이지가 위치할 폴더
- routes/ : 라우팅 정의
- .env : 환경변수 정의 (DB 접속 URI, 파일 저장 위치)
- app.js : Express 서버 정의

## .env 설정
- 해당 파일 내 주석 참고

## 서버 실행
### 패키지 설치
```
npm install
```

### 서버 실행
```
npm start
```
:exclamation: 포트 기본값: 3000

## APIs
### Objects
<details>
<summary>접기/펼치기</summary>

#### Creation
- Request type: POST
- URI: /api/objects
- Body: (JSON object)

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|name|String|오브젝트 이름|:o:|
|objectImage|File|이미지 파일|:x: (Optional)|

- Response: 

|Code|Data|Description|
|:-|:-|:-|
|201|response.data.objectCreated|생성된 오브젝트 반환|
|500||생성 실패|

#### Retrieval
- Request type: GET
- URI: /api/objects
- Query:

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|name|String|조회할 오브젝트 이름|:x: (Optional)|

- Response: 

|Code|Data|Description|
|:-|:-|:-|
|200|response.data|조회 결과 반환|
|500||조회 실패|

- Example: 
```
GET /api/objects : 전체 오브젝트 조회
GET /api/objects?name=test : 이름이 test인 오브젝트 조회
```

#### Deletion
- Request type: DELETE
- URI: /api/objects/:_id
- Params

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|_id|String|삭제할 오브젝트 id|:o:|

- Response: 

|Code|Description|
|:-|:-|
|200|삭제 성공|
|400|삭제할 데이터 없음|
|500|오류 발생|

- Example: 
```
DELETE /api/objects/1234 : _id가 1234인 오브젝트 삭제
```

</details>

### Problems
<details>
<summary>접기/펼치기</summary>

#### Creation
- Request type: POST
- URI: /api/problems
- Body: (JSON object)

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|firstGroup|[String]|좌측 선택지 그룹(오브젝트 이름 배열)|:o:|
|secondGroup|[String]|우측 선택지 그룹(오브젝트 이름 배열)|:o:|
|correctAnswer|"Left" \| "Right"|정답|:o:|

- Response: 

|Code|Data|Description|
|:-|:-|:-|
|201|response.data._id|생성된 문제 id|
|500||생성 실패|

#### Retrieval
- Request type: GET
- URI: /api/problems
- Query:

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|count|Number|문제 샘플 크기|:x: (Optional)|
|_id|String|조회할 문제 id|:x: (Optional)|

- Response: 

|Code|Data|Description|
|:-|:-|:-|
|200|response.data|조회 결과 반환|
|500||조회 실패|

- Example: 
```
GET /api/problems : 전체 문제 조회
GET /api/problems?_id=1234 : _id가 1234인 문제 조회
GET /api/problems?count=3 : 무작위 3개 문제 조회
```
:exclamation: count조건이 있을 경우 _id 조건은 무시

#### Deletion
- Request type: DELETE
- URI: /api/problems/:_id
- Params

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|_id|String|삭제할 문제 id|:o:|

- Response: 

|Code|Description|
|:-|:-|
|200|삭제 성공|
|400|삭제할 데이터 없음|
|500|오류 발생|

- Example: 
```
DELETE /api/problems/1234 : _id가 1234인 문제 삭제
```

</details>

### Questions
<details>
<summary>접기/펼치기</summary>

#### Creation
- Request type: POST
- URI: /api/questions
- Body: (JSON object)

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|order|Number|문항 번호|:o:|
|title|String|질문 내용|:o:|
|type|"MultipleChoice" \| "Descriptive" \| "LikertScale"|질문 유형|:o:|
|option|[String]|객관식 선택지|:question:(객관식인 경우 필수)|

- Response: 

|Code|Data|Description|
|:-|:-|:-|
|201|response.data._id|생성된 질문 id|
|500||생성 실패|

#### Retrieval
- Request type: GET
- URI: /api/questions
- Query:

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|_id|String|조회할 질문 id|:x: (Optional)|

- Response: 

|Code|Data|Description|
|:-|:-|:-|
|200|response.data|조회 결과 반환|
|500||조회 실패|

- Example: 
```
GET /api/questions : 전체 질문 조회
GET /api/questions?_id=1234 : _id가 1234인 질문 조회
```

#### Deletion
- Request type: DELETE
- URI: /api/questions/:_id
- Params

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|_id|String|삭제할 질문 id|:o:|

- Response: 

|Code|Description|
|:-|:-|
|200|삭제 성공|
|400|삭제할 데이터 없음|
|500|오류 발생|

- Example: 
```
DELETE /api/questions/1234 : _id가 1234인 질문 삭제
```

</details>

### Responses
<details>
<summary>접기/펼치기</summary>

#### Creation
- Request type: POST
- URI: /api/responses
- Body: (JSON object)

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|uuid|String|응답 id|:o:|
|responseTo|"Survey" \| "Test"|응답 유형(설문 응답/문제 풀이)|:o:|
|answers|[{answerTo: String, answer: String}]|응답 배열 (answerTo: 질문/문제 id)|:o:|

- Response: 

|Code|Description|
|:-|:-|
|201|응답 저장 성공|
|500|저장 실패|

#### Retrieval
- Request type: GET
- URI: /api/responses
- Query:

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|uuid|String|조회할 응답 uuid|:x: (Optional)|
|responseTo|"Survey" \| "Test"|조회할 응답 유형|:x: (Optional)|

- Response: 

|Code|Data|Description|
|:-|:-|:-|
|200|response.data|조회 결과 반환|
|500||조회 실패|

- Example: 
```
GET /api/responses : 전체 응답 조회
GET /api/responses?uuid=1234 : uuid가 1234인 응답 조회
GET /api/responses?responseTo=Survey : 모든 설문 응답 조회
GET /api/responses?responseTo=Test : 모든 문제 응답 조회
GET /api/responses?uuid=1234&responseTo=Survey : uuid 1234의 설문 응답 조회
```

#### Deletion
- Request type: DELETE
- URI: /api/responses/:_id
- Params

|Key|Type|Description|Required|
|:-|:-|:-|:-:|
|_id|String|삭제할 응답 id|:o:|

- Response: 

|Code|Description|
|:-|:-|
|200|삭제 성공|
|400|삭제할 데이터 없음|
|500|오류 발생|

- Example: 
```
DELETE /api/responses/1234 : _id가 1234인 응답 삭제
```

</details>

### UUID
<details>
<summary>접기/펼치기</summary>
#### Retrieve
- Request type: GET
- URI: /api/uuid
- Response: 

|Code|Data|Description|
|:-|:-|:-|
|200|response.data|랜덤 uuid|

- Example: 
```
GET /api/uuid : 랜덤 uuid 발급
```
</details>