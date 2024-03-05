DROP DATABASE IF EXISTS afya_centre;

CREATE DATABASE IF NOT EXISTS afya_centre; 
USE afya_centre;

CREATE TABLE users(
   First_name VARCHAR(32)
  ,Last_name VARCHAR(32)
  ,Email VARCHAR(37) NOT NULL
  ,Password VARCHAR(255)  NOT NULL
  ,PRIMARY KEY (Email)  
);

CREATE TABLE articles(
	article_ID varchar(10) NOT NULL,
    Title VARCHAR(45),
    Link TEXT,
    PRIMARY KEY (article_ID)
);

INSERT INTO articles (article_ID,Title,Link) VALUES ('A001','Healthy living','https://www.healthline.com/health/fitness-nutrition/healthy-lifestyle-benefits');
INSERT INTO articles (article_ID,Title,Link) VALUES ('A002','Fatty Liver','https://my.clevelandclinic.org/health/diseases/15831-fatty-liver-disease');
INSERT INTO articles (article_ID,Title,Link) VALUES ('A003','Obesity code','https://miracleinthegreen.com/blogs/news/jason-fung-the-code-of-obesity');

CREATE TABLE support(
	support_ID INT AUTO_INCREMENT,
    User_name VARCHAR(45) NOT NULL,
    email VARCHAR(37) NOT NULL,
    issue TEXT NOT NULL,
    PRIMARY KEY (support_ID)
);

CREATE TABLE meal_plan(
	meal_plan_ID VARCHAR(10) NOT NULL,
    name_plan VARCHAR(45) NOT NULL,
    Descript TEXT NOT NULL,
    PRIMARY KEY (meal_plan_ID)
);

INSERT INTO meal_plan (meal_plan_ID,name_plan,Descript) VALUES ('M001','Children diet','Designed for the nutritional needs of growing children.');
INSERT INTO meal_plan (meal_plan_ID,name_plan,Descript) VALUES ('M002','Lactating Mothers','Specially crafted for mothers during the lactating phase.');
INSERT INTO meal_plan (meal_plan_ID,name_plan,Descript) VALUES ('M003','Pregnant Mothers','Designed for the nutritional needs of pregnant women.');
INSERT INTO meal_plan (meal_plan_ID,name_plan,Descript) VALUES ('M004','Carnivore diet','Embrace a diet focused on animal-based foods.');

CREATE TABLE user_meal_plan(
	meal_plan_ID VARCHAR(10) NOT NULL,
    email VARCHAR(37) NOT NULL,
    PRIMARY KEY (meal_plan_ID, email),
    FOREIGN KEY (meal_plan_ID) REFERENCES meal_plan (meal_plan_ID),
    FOREIGN KEY (email) REFERENCES users (Email)
);

CREATE TABLE gym_plan(
	gym_plan_ID VARCHAR(10) NOT NULL,
    name_plan VARCHAR(45) NOT NULL,
    Descript TEXT NOT NULL,
    PRIMARY KEY (gym_plan_ID)
);

INSERT INTO gym_plan (gym_plan_ID,name_plan,Descript) VALUES ('G001','Strength training','Designed for gaining strength');
INSERT INTO gym_plan (gym_plan_ID,name_plan,Descript) VALUES ('G002','Home workout','No equipment needed.');
INSERT INTO gym_plan (gym_plan_ID,name_plan,Descript) VALUES ('G003','Cardio','Let"s cardio it.');
INSERT INTO gym_plan (gym_plan_ID,name_plan,Descript) VALUES ('G004','HIIT','HIITs');

CREATE TABLE user_gym_plan(
	gym_plan_ID VARCHAR(10) NOT NULL,
    email VARCHAR(37) NOT NULL,
    PRIMARY KEY (gym_plan_ID, email),
    FOREIGN KEY (gym_plan_ID) REFERENCES gym_plan (gym_plan_ID),
    FOREIGN KEY (email) REFERENCES users (Email)
);

CREATE TABLE habit(
	habit_ID VARCHAR(10) NOT NULL,
    name_habit VARCHAR(45) NOT NULL,
    Total_time INT,
    PRIMARY KEY (habit_ID)
);

INSERT INTO habit (habit_ID,name_habit,Total_time) VALUES ('H001','Book reading','45');
INSERT INTO habit (habit_ID,name_habit,Total_time) VALUES ('H002','Meditating','20');
INSERT INTO habit (habit_ID,name_habit,Total_time) VALUES ('H003','Book workout','50');

CREATE TABLE user_habit(
	habit_ID VARCHAR(10) NOT NULL,
    email VARCHAR(37) NOT NULL,
    Time_completed INT,
    PRIMARY KEY (habit_ID, email),
    FOREIGN KEY (habit_ID) REFERENCES habit (habit_ID),
    FOREIGN KEY (email) REFERENCES users (Email)
);

CREATE TABLE fasting(
	fast_ID VARCHAR(10) NOT NULL,
    fast_type VARCHAR(45) NOT NULL,
    hours INT,
    PRIMARY KEY (fast_ID)
);

INSERT INTO fasting (fast_ID,fast_type,hours) VALUES ('F001','16 HOURS','16');
INSERT INTO fasting (fast_ID,fast_type,hours) VALUES ('F002','24 HOURS','24');
INSERT INTO fasting (fast_ID,fast_type,hours) VALUES ('F003','48 HOURS','48');

CREATE TABLE user_fast(
	fast_ID VARCHAR(10) NOT NULL,
    email VARCHAR(37) NOT NULL,
    Total_time_completed INT,
    FOREIGN KEY (fast_ID) REFERENCES fasting (fast_ID),
    FOREIGN KEY (email) REFERENCES users (Email)
);

CREATE TABLE messages(
	message_ID VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(message_ID)
);

CREATE TABLE msg_sender(
    message_ID VARCHAR(10) NOT NULL,
    sender_email VARCHAR(37) NOT NULL,
    FOREIGN KEY (message_ID) REFERENCES messages(message_ID),
    FOREIGN KEY (sender_email) REFERENCES users (Email)
);

SHOW TABLES;