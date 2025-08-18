-- //DB 생성, 인코딩 설정//--
CREATE DATABASE IF NOT EXISTS PIGO_DB
    DEFAULT CHARACTER SET utf8mb4
	DEFAULT COLLATE utf8mb4_general_ci;
USE PIGO_DB;

-- //UserTable 생성//--
CREATE TABLE IF NOT EXISTS UserTable (
	user_id BIGINT PRIMARY KEY,
	user_name VARCHAR(100) NOT NULL,
	user_email VARCHAR(100) NOT NULL,
	user_sex ENUM('male', 'female') DEFAULT 'male',
	user_age DATETIME DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4;

-- //TourTable 생성//--
CREATE TABLE IF NOT EXISTS TourTable (
	contentid VARCHAR(10) PRIMARY KEY,
	contenttypeid VARCHAR(5) NOT NULL,
	addr1 VARCHAR(100) NOT NULL,
	title VARCHAR(20) NOT NULL,
	mapx REAL NOT NULL,
	mapy REAL NOT NULL,
	firstimage VARCHAR(250) DEFAULT '',
    firstimage2 VARCHAR(250) DEFAULT '',
    lDongRegnCd VARCHAR(5) NOT NULL,
    lDongSignguCd VARCHAR(5) NOT NULL,
    lclsSystm1 VARCHAR(10) NOT NULL,
    lclsSystm2 VARCHAR(10) NOT NULL,
    lclsSystm3 VARCHAR(10) NOT NULL,
	avg_rating DECIMAL(3,2) DEFAULT 0
) CHARACTER SET utf8mb4;

-- //InterTourTable 생성//--
CREATE TABLE IF NOT EXISTS InterTourTable (
	tour_user_id INT PRIMARY KEY AUTO_INCREMENT,

	user_id BIGINT,
	CONSTRAINT fk_user_tour FOREIGN KEY (user_id) REFERENCES UserTable(user_id), 

	tour_id VARCHAR(10),
	CONSTRAINT fk_tour FOREIGN KEY (tour_id) REFERENCES TourTable(contentid)

) CHARACTER SET utf8mb4;

-- //InterLocationTable 생성//--
CREATE TABLE IF NOT EXISTS InterLocationTable (
	id INT PRIMARY KEY AUTO_INCREMENT,

	user_id BIGINT,
	CONSTRAINT fk_user_Locate FOREIGN KEY (user_id) REFERENCES UserTable(user_id), 

	lDongRegnCd VARCHAR(5),
	lDongSignguCd VARCHAR(5)

) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS VisitedTourTable (
	id INT PRIMARY KEY AUTO_INCREMENT,
	
	user_id BIGINT,
	CONSTRAINT fk_user_Visited FOREIGN KEY (user_id) REFERENCES UserTable(user_id),

	tour_id VARCHAR(10),
	CONSTRAINT fk_tour_Visited FOREIGN KEY (tour_id) REFERENCES TourTable(contentid),

	visited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS ReviewTable(
	review_id INT PRIMARY KEY AUTO_INCREMENT,
	
	user_id BIGINT NOT NULL,
	CONSTRAINT fk_user_Review FOREIGN KEY (user_id) REFERENCES UserTable(user_id),

	tour_id VARCHAR(10) NOT NULL,
	CONSTRAINT fk_tour_Review FOREIGN KEY (tour_id) REFERENCES TourTable(contentid),

	content TEXT NOT NULL,

	created DATETIME DEFAULT CURRENT_TIMESTAMP,

	edited DATETIME DEFAULT CURRENT_TIMESTAMP,

	rating INT NOT NULL,

	parentid INT DEFAULT 0,

	is_deleted BIT DEFAULT 0
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS LikeTable(
	id INT PRIMARY KEY AUTO_INCREMENT,

	user_id BIGINT,
	CONSTRAINT fk_user_Like FOREIGN KEY (user_id) REFERENCES UserTable(user_id),

	review_id INT,
	CONSTRAINT fk_review_Like FOREIGN KEY (review_id) REFERENCES ReviewTable(review_id),

	is_like BIT DEFAULT 1
) CHARACTER SET utf8mb4;

SET FOREIGN_KEY_CHECKS=0;


-- //테스트 데이터 삽입//--
-- INSERT INTO UserTable
-- VALUES (1, 'test1', 'tjdgkr0719@khu.ac.kr','male', 20);

-- INSERT INTO UserTable
-- VALUES (2, 'test2', 'hsgpmh72@gmail.com','male', 40);

INSERT INTO TourTable (
  contentid,
  contenttypeid,
  addr1,
  title,
  mapx,
  mapy,
  firstimage,
  firstimage2,
  lDongRegnCd,
  lDongSignguCd,
  lclsSystm1,
  lclsSystm2,
  lclsSystm3,
  avg_rating
) VALUES (
  '3505386',
  '39',
  '서울특별시 중구 퇴계로6길 3-28 (회현동1가)',
  '관광지 제목',
  126.9780,
  37.5665,
  'http://tong.visitkorea.or.kr/cms/resource/81/3505381_image2_1.jpg',
  'http://tong.visitkorea.or.kr/cms/resource/81/3505381_image3_1.jpg',
  '11',
  '140',
  'FD',
  'FD01',
  'FD010100',
  0.00
);

-- INSERT INTO TourTable
-- VALUES (1000981, 14, '경상남도 통영시 해평5길 142-16', 
-- 'http://tong.visitkorea.or.kr/cms/resource/22/2367622_image2_1.jpg',
-- 'http://tong.visitkorea.or.kr/cms/resource/22/2367622_image3_1.jpg',
--  '48', '220', 'VE', 'VE07', 'VE070300');

-- INSERT INTO TourTable
-- VALUES (1008362, 28, '서울특별시 중구 퇴계로6길 3-28 (회현동1가)', 
-- 'http://tong.visitkorea.or.kr/cms/resource/21/1970121_image2_1.jpg',
-- 'http://tong.visitkorea.or.kr/cms/resource/21/1970121_image3_1.jpg',
--  '27', '140', 'LS', 'LS01', 'LS011900');


INSERT INTO InterTourTable (user_id, tour_id)
VALUES (1, 3505386);

INSERT INTO InterTourTable (user_id, tour_id)
VALUES (1, 1000981);

INSERT INTO InterTourTable (user_id, tour_id)
VALUES (1, 1008362);

INSERT INTO InterTourTable (user_id, tour_id)
VALUES (2, 1008362);

INSERT INTO InterLocationTable (user_id, lDongRegnCd, lDongSignguCd)
VALUES (1, '11', '140');

INSERT INTO InterLocationTable (user_id, lDongRegnCd, lDongSignguCd)
VALUES (1, '48', '220');

INSERT INTO InterLocationTable (user_id, lDongRegnCd, lDongSignguCd)
VALUES (2, '27', '140');



SET FOREIGN_KEY_CHECKS=1;