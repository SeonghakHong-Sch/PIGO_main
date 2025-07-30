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
	user_sex ENUM('male', 'female') DEFAULT NULL,
	user_age INT DEFAULT 0
) CHARACTER SET utf8mb4;

-- //TourTable 생성//--
CREATE TABLE IF NOT EXISTS TourTable (
	contentid VARCHAR(100) PRIMARY KEY,
	contenttypedid VARCHAR(100) NULL,
	tour_addr VARCHAR(250),
	firstimage VARCHAR(500) DEFAULT '',
    firstimage2 VARCHAR(500) DEFAULT '',
    lDongRegnCd VARCHAR(5) NOT NULL,
    lDongSignguCd VARCHAR(5) NOT NULL,
    lclsSystm1 VARCHAR(10) NOT NULL,
    lclsSystm2 VARCHAR(10) NOT NULL,
    lclsSystm3 VARCHAR(10) NOT NULL
) CHARACTER SET utf8mb4;

-- //InterTourTable 생성//--
CREATE TABLE IF NOT EXISTS InterTourTable (
	tour_user_id INT PRIMARY KEY AUTO_INCREMENT,

	user_id INT,
	CONSTRAINT fk_user_tour FOREIGN KEY (user_id) REFERENCES UserTable(user_id), 

	tour_id VARCHAR(10),
	CONSTRAINT fk_tour FOREIGN KEY (tour_id) REFERENCES TourTable(contentid)

) CHARACTER SET utf8mb4;

-- //InterLocationTable 생성//--
CREATE TABLE IF NOT EXISTS InterLocationTable (
	id INT PRIMARY KEY AUTO_INCREMENT,

	user_id INT,
	CONSTRAINT fk_user_Locate FOREIGN KEY (user_id) REFERENCES UserTable(user_id), 

	lDongRegnCd VARCHAR(5),
	-- CONSTRAINT fk_Regn FOREIGN KEY (lDongRegnCd) REFERENCES TourTable(lDongRegnCd),

	lDongSignguCd VARCHAR(5)
	-- CONSTRAINT fk_Regn FOREIGN KEY (lDongSignguCd) REFERENCES TourTable(lDongSignguCd),

) CHARACTER SET utf8mb4;


SET FOREIGN_KEY_CHECKS=0;


-- //테스트 데이터 삽입//--
INSERT INTO UserTable (user_name, user_email, user_sex, user_age)
VALUES ('test1', 'tjdgkr0719@khu.ac.kr','male', 20);

INSERT INTO UserTable (user_name, user_email, user_sex, user_age)
VALUES ('test2', 'hsgpmh72@gmail.com','male', 40);

INSERT INTO TourTable
VALUES ('3505386', '39', '서울특별시 중구 퇴계로6길 3-28 (회현동1가)', 
'http://tong.visitkorea.or.kr/cms/resource/81/3505381_image2_1.jpg',
'http://tong.visitkorea.or.kr/cms/resource/81/3505381_image3_1.jpg',
 '11', '140', 'FD', 'FD01', 'FD010100');

INSERT INTO TourTable
VALUES ('1000981', '14', '경상남도 통영시 해평5길 142-16', 
'http://tong.visitkorea.or.kr/cms/resource/22/2367622_image2_1.jpg',
'http://tong.visitkorea.or.kr/cms/resource/22/2367622_image3_1.jpg',
 '48', '220', 'VE', 'VE07', 'VE070300');

INSERT INTO TourTable
VALUES ('1008362', '28', '서울특별시 중구 퇴계로6길 3-28 (회현동1가)', 
'http://tong.visitkorea.or.kr/cms/resource/21/1970121_image2_1.jpg',
'http://tong.visitkorea.or.kr/cms/resource/21/1970121_image3_1.jpg',
 '27', '140', 'LS', 'LS01', 'LS011900');


INSERT INTO InterTourTable (user_id, tour_id)
VALUES (1, '3505386');

INSERT INTO InterTourTable (user_id, tour_id)
VALUES (1, '1000981');

INSERT INTO InterTourTable (user_id, tour_id)
VALUES (1, '1008362');

INSERT INTO InterTourTable (user_id, tour_id)
VALUES (2, '1008362');

INSERT INTO InterLocationTable (user_id, lDongRegnCd, lDongSignguCd)
VALUES (1, '11', '140');

INSERT INTO InterLocationTable (user_id, lDongRegnCd, lDongSignguCd)
VALUES (1, '48', '220');

INSERT INTO InterLocationTable (user_id, lDongRegnCd, lDongSignguCd)
VALUES (2, '27', '140');



SET FOREIGN_KEY_CHECKS=1;