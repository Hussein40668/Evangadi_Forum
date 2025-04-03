const dbConnection = require("../db/dbConfig");

const registration = `
CREATE TABLE if not exists registration(
user_id INT(20) NOT NULL AUTO_INCREMENT,
username VARCHAR(20) NOT NULL,
email VARCHAR(40) NOT NULL,
password VARCHAR(100) NOT NULL,
PRIMARY KEY (user_id)
);
`;

const profile = `
CREATE TABLE if not exists profile(
user_profile_id INT(20) NOT NULL AUTO_INCREMENT,
user_id INT(20) NOT NULL,
firstname VARCHAR(20) NOT NULL,
lastname VARCHAR(20) NOT NULL,
PRIMARY KEY (user_profile_id),
FOREIGN KEY (user_id) REFERENCES registration(user_id));
`;

const questions = `
CREATE TABLE if not exists questions(
id INT(20) NOT NULL AUTO_INCREMENT,
question_id VARCHAR(100) NOT NULL UNIQUE,
user_id INT(20) NOT NULL,
title TEXT NOT NULL,
description TEXT NOT NULL,
tag VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
likes INT(20),
dislike INT(20),
PRIMARY KEY (id,question_id),
FOREIGN KEY (user_id) REFERENCES registration(user_id));
`;

const answers = `
CREATE TABLE if not exists answers(
answer_id INT(20) NOT NULL AUTO_INCREMENT,
user_id INT(20) NOT NULL,
question_id VARCHAR(100) NOT NULL,
answer TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
likes INT(20),
dislike INT(20),
PRIMARY KEY (answer_id),
FOREIGN KEY (question_id) REFERENCES questions(question_id),
FOREIGN KEY (user_id) REFERENCES registration(user_id)
);
`;

const replies = `
CREATE TABLE IF NOT EXISTS replies (
  reply_id INT AUTO_INCREMENT NOT NULL,
  answer_id INT NOT NULL,
  user_id INT NOT NULL,
  reply TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (reply_id),
  FOREIGN KEY (answer_id) REFERENCES answers(answer_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE
);
`;

async function createTables(req, res) {
  try {
    await dbConnection.query(registration);
    console.log("✅ Registration table created successfully");

    await dbConnection.query(profile);
    console.log("✅ Profile table created successfully");

    await dbConnection.query(questions);
    console.log("✅ Questions table created successfully");

    await dbConnection.query(answers);
    console.log("✅ Answers table created successfully");

    await dbConnection.query(replies);
    console.log("✅ Replies table created successfully");

    res.send("✅ Tables created successfully.");
  } catch (err) {
    console.log("❌ There was an error creating one or more tables", err);
    res.status(500).send("❌ Error creating tables.");
  }
}

module.exports = createTables;
