const dbConnection = require("../db/dbConfig");

// Creating commands for db
const users = `
  CREATE TABLE IF NOT EXISTS users (  
    user_id INT(20) NOT NULL AUTO_INCREMENT,  
    username VARCHAR(20) NOT NULL UNIQUE,  
    firstname VARCHAR(20) NOT NULL,  
    lastname VARCHAR(20) NOT NULL,  
    email VARCHAR(40) NOT NULL UNIQUE,  
    password VARCHAR(100) NOT NULL,  
    PRIMARY KEY(user_id)  
  );  
`;

const profiles = `CREATE TABLE IF NOT EXISTS profile(
user_profile_id INT(20) NOT NULL AUTO_INCREMENT,
user_id INT(20) NOT NULL,
firstname VARCHAR(20) NOT NULL,
lastname VARCHAR(20) NOT NULL,
PRIMARY KEY (user_profile_id),
FOREIGN KEY (user_id) REFERENCES registration(user_id)
);
`;

const questions = `
  CREATE TABLE IF NOT EXISTS questions (
id INT(20) NOT NULL AUTO_INCREMENT,
question_id VARCHAR(100) NOT NULL UNIQUE,
user_id INT(20) NOT NULL,
title TEXT NOT NULL,
description TEXT NOT NULL,
tag VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
likes INT(20)
dislike INT(20)
PRIMARY KEY (id,question_id),
FOREIGN KEY (user_id) REFERENCES users(user_id));
  );
`;

const answers = `
  CREATE TABLE IF NOT EXISTS answers (  
answer_id INT(20) NOT NULL AUTO_INCREMENT,
user_id INT(20) NOT NULL,
question_id VARCHAR(100) NOT NULL,
answer TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
likes INT(20)
dislike INT(20)
PRIMARY KEY (answer_id),
FOREIGN KEY (question_id) REFERENCES questions(question_id),
FOREIGN KEY (user_id) REFERENCES users(user_id) 
  );
`;

const replies = `
  CREATE TABLE IF NOT EXISTS replies (
    reply_id INT(20) AUTO_INCREMENT NOT NULL,
    answer_id INT(20) NOT NULL,
    user_id INT(20) NOT NULL,
    reply TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reply_id),
    FOREIGN KEY (answer_id) REFERENCES answers(answerid) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(userid) ON DELETE CASCADE
  );
`;

const userAnswerInteractions = `
  CREATE TABLE IF NOT EXISTS user_answer_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT(20) NOT NULL,
    answer_id INT(20) NOT NULL,
    interaction_type ENUM('like', 'dislike') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answers(answerid) ON DELETE CASCADE,
    UNIQUE KEY unique_interaction (user_id, answer_id)
  );
`;

// Creating tables programmatically
async function createTables(req, res) {
  try {
    await dbConnection.query(users);
      console.log("✅Users table created successfully");
      
      await dbConnection.query(profiles);
      console.log("✅profiles table created successfully");


    await dbConnection.query(questions);
    console.log("✅Questions table created successfully");

    await dbConnection.query(answers);
    console.log("✅Answers table created successfully");

    await dbConnection.query(replies);
    console.log("✅Replies table created successfully");

    await dbConnection.query(userAnswerInteractions);
    console.log("✅User_answer_interactions table created successfully");

    res.send(
      "✅You have created the tables successfully! Or they have already been created."
    );
  } catch (err) {
    console.log("❌There was an error creating one or more tables", err);
    res.status(500).send("❌Error creating tables.");
  }
}

module.exports = createTables;
