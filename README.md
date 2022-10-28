<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->





<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#환경셋팅">환경셋팅</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
# [프리온보딩] 웨인힐스벤처스 게시판 서버 개발 프로젝트

## About The Project

### 프로젝트 개요

#### 서비스 개요
    - 우리는 다양한 사용자가 자유롭게 게시글을 쓰고 공유하는 서비스를 가정하였다.
    - 그렇기에 사용자는 외원가입하고 0000는 000 … 하도록 구현 하였다.
- 요구사항
    - 필수 데이터: 회원정보. 필수 데이터를 제외한 나머지 데이터는 자유롭게 추가 가능하다. 자세한 추가 사항은 ERD 항목 참조.
        - columns:
            - 고객명
            - 회원등급
            - 성별
            - 나이
            - 연락처
            - 가입일
            - 마지막 접속일
    - REST API 개발(요구 기능)
        - 회원가입 / 로그인(소셜 로그인, 비 소셜 로그인) / 회원탈퇴
        - 이용자 통계 집계 기능(예: 성별, 나이별, 접속 시간별 통계)
        - 게시판: 등급에 따라 기능 이용에 차등 필요
        - 회원등급: 3등급으로 나눴다(관리자, 매니저, 일반회원)
        - 등급에 따른 기능 이용
            
            
            |  | 관리자 | 매니저 | 일반 회원 | 비고 |
            | --- | --- | --- | --- | --- |
            | 공지사항 | C,R,U,D | R | R | 모두 읽을 수 있음 |
            | 운영 게시판 | C,R,U,D | C,R,U,D | 없음 | U 는 쓴 사람과 관리자 |
            | 자유 게시판 | C,R,U,D | C,R,U,D | C,R,U,D | U 는 오직 쓴 사람만 가능 |
            | 비고 | 관리자는 모든 게시물 삭제 가능.  | 매니저는 자유 게시판의 게시물을 모두 지울 수 있음 |  |  |
- 개발 조건
    - database 는 RDB 사용
    - 통계가 다양할수록 가산점 존재
    - 그 외 자유롭게 개발
    - 제출 항목은 신경쓰지 않아도 괜찮다.(멘토님 말씀)
- 책임
    
    
    | 김성식 | 김혜린 | 문정진 | 이석원 |
    | --- | --- | --- | --- |
    | 회원가입 / 로그인 / 회원탈퇴 구현 | 회원 등급에 따른 게시판 기능 접근 제어 | 이용 통계 집계 | 공지사항 / 자유게시판 / 운영게시판 구현 |
    |  | 데이터베이스 작성 | 초기 환경 셋팅 / ERD 작성 |  |
- 개발 우선순위
    1. 완성: 일정 준수 / API 정상 작동 / 코딩 컨벤션 / 코드패키지 구조
        1. 2022.10.28.금요일 23:59 까지 API 완성
        2. API 정상 작동 테스트: 금요일 17:00-24:00 까지
        3. 금요일 내로 README 작성
    2. 완성도: 비즈니스 로직 / 확장과 성능을 고려한 개발 
        1. 테스트 코드 작성
    3. 추가 구현: 자세한 내용은 아래에 있음
        1. 금요일 이후에 구현 
- 추가 구현 목표
    - 게시판(우선순위): 좋아요 / 댓글 / 이미지 삽입(AWS S3) / Cache(node-cache 또는 LRU-cache 또는 Redis)

### ERD
<img width="880" alt="스크린샷 2022-10-19 오후 7 14 59" src="https://user-images.githubusercontent.com/88824305/198552155-0b658e53-5dc6-4568-9c9c-a07247bce9f0.png">
</br>

- grade table: 사용자의 등급을 정해서 게시판 기능 이용에 차등을 주도록 설계했음
- board table: 기능 이용 등급 차등화를 위해서 게시판에도 등급을 부여했음(type table)
- user table: soft delete 와 hard delete 를 구분했음. deleted_at 칼럼을 작성함.
- user table: 소셜 로그인과 로컬 로그인 가능. name 이 겹칠 우려가 있어 platform_type table 작성함.

### Built With

- Javascript
- Sequelize
- Node Js
- Postman
- Slack
- Discord
- Jest
- Supertest



<!-- GETTING STARTED -->
## Getting Started
```
.
├── app.js
├── package-lock.json
├── package.json
├── server.js
└── src
    ├── config
    │   └── config.json
    ├── controllers
    │   ├── boardController.js
    │   ├── index.js
    │   ├── statisticsController.js
    │   └── userController.js
    ├── middlewares
    │   ├── auth.js
    │   ├── container.js
    │   ├── errorConstructor.js
    │   ├── errorHandler.js
    │   └── extendError.js
    ├── models
    │   ├── board.js
    │   ├── gender.js
    │   ├── grade.js
    │   ├── index.js
    │   ├── platformType.js
    │   ├── type.js
    │   ├── user.js
    │   └── user_access.js
    ├── routes
    │   ├── boardRouter.js
    │   ├── index.js
    │   ├── statisticsRouter.js
    │   └── userRouter.js
    ├── services
    │   ├── boardService.js
    │   ├── index.js
    │   ├── statisticsService.js
    │   └── userService.js
    └── tests
        ├── boardService.test.js
        └── middlewares.test.js
```

### 환경셋팅

- 프로젝트 셋업(Git repository & Server 초기세팅)
    - server 셋팅
        - sequelize 를 사용함
        - routes-controllers-services: 시퀄라이즈를 사용해 service layer 에서 DB 사용.
                
    - Git repo
        - 짧은 프로젝트 기간을 고려해 git flow 는 단순화했음: main-feature branch
        - 동료 리뷰는 Discord, Slack 으로 했음. Github pr 은 병목이 생길 우려가 있어서 리뷰를 하지 않기로 했음.
        - git 컨벤션: [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/)



<!-- USAGE EXAMPLES -->
## Usage

[API 명세](https://docs.google.com/spreadsheets/d/1ei1Tc8sxuUlmtTEqNQ5c1Vg1pX1fGxCkmewfgoIq6qY/edit#gid=1153640910)


<!-- ROADMAP -->
## Roadmap

#### 구현 목표 

- [x] 로컬 로그인
- [x] 소셜 로그인
- [x] 회원가입 / 회원탈퇴
- [x] 게시판 기능 접근 제어자
- [x] 이용자 통계 기능
- [x] 자유게시판 / 운영게시판 / 공지사항
    - [ ] 좋아요
    - [ ] 댓글
    - [ ] 이미지 (AWS S3)
    - [ ] User unit test / integration test
    - [ ] E2E test


