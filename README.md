# nodejs-mongoose-blog

### 전역모듈
  - mongodb, nodemon

### setting
    npm install
    mkdir uploads
    chmod 707 uploads/
    npm start


### node_module
  - mongodb
  - mongoose : DB스키마 정리및 auto incremet 용 ( model 폴더 확인 )
  - mongodb-auto-inrement : unique 키 지정및 auto increament 적용
  - multer : 이미지 업로드용 모듈

### 라우팅 구조
  - post/ => 리스트전체 나열
  - post/write => 글작성
  - post/detail/:id => 상세글 보기
  - post/edit/:id => 글수정
  - post/delete/:id => 글삭제

