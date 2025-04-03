const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const keywords = require("../Utility/keywords");
const db = require("../db/dbConfig");
async function allQuestions(req, res) {
  try {
    // Using JOIN to get questions with usernames in a single query
    const [questions] = await db.query(`
      SELECT 
        q.question_id,
        q.title,
        q.description AS content,
        q.created_at,
        q.tag,
        q.likes,
        q.dislike AS disLikes,
        r.username AS user_name,
        IFNULL(r.username, 'Unknown User') AS user_name
      FROM 
        questions q
      LEFT JOIN 
        registration r ON q.user_id = r.user_id
      ORDER BY 
        q.id DESC
    `);

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No Question Found" });
    }

    // Map the results to your desired format
    const allQuestions = questions.map((question) => ({
      question_id: question.question_id,
      title: question.title,
      content: question.content,
      user_name: question.user_name,
      created_at: question.created_at,
      tag: question.tag,
      likes: question.likes,
      dislike: question.disLikes,
    }));

    return res.status(StatusCodes.OK).json({ questions: allQuestions });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Unexpected Error Occurred" });
  }
}
async function postQuestion(req, res) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const [question] = await db.query(
      "SELECT title, description FROM questions WHERE title=? and description=?",
      [title, description]
    );
    if (question.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Same question already asked!" });
    }

    // Generate a unique questionid for each question post using uuid
    const questionid = uuidv4(); // Example: '550e8400-e29b-41d4-a716-446655440000'
    console.log(questionid);

    // Extract userid from currently logged in user info with help of jwt
    const userid = req.user.userid;

    // Extract a Tags from the title of question post
    const lowerCaseTitle = title.toLowerCase();
    const matchTag = keywords.filter((keyTag) =>
      lowerCaseTitle.includes(keyTag.toLowerCase())
    );
    const tag = matchTag.length > 0 ? matchTag : ["General"];
    const stringTag = tag.join(",");
    await db.query(
      "INSERT INTO questions (question_id,user_id,title,description,tag,likes,dislike) VALUES (?,?,?,?,?,0,0) ",
      [questionid, userid, title, description, stringTag]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question Created Successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Expected Error Occurred" });
  }
}

async function singleQuestion(req, res) {
  // res.status(StatusCodes.OK).json({ msg: "Single Question Displayed" });
  const { question_id } = req.params;
  try {
    const [question] = await db.query(
      "SELECT * FROM questions WHERE question_id=?",
      [question_id]
    );
    if (question.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The requested question could not be Found" });
    }
    const questionId = question[0].id;
    const title = question[0].title;
    const content = question[0].description;
    const userId = question[0].user_id;
    const createdAt = question[0].created_at;

    return res.status(StatusCodes.OK).json({
      question: {
        question_id: questionId,
        title: title,
        content: content,
        user_id: userId,
        created_at: createdAt,
      },
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Expected Error Occurred" });
  }
}
async function likeQuestion(req, res) {
  const { question_id } = req.params;
  try {
    await db.query(
      "UPDATE questions SET likes = likes + 1 WHERE question_id = ?",
      [question_id]
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Likes count successfully Incremented" });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Expected Error Occurred" });
  }
}

async function disLikeQuestion(req, res) {
  const { question_id } = req.params;
  try {
    await db.query(
      "UPDATE questions SET dislike = dislike + 1 WHERE question_id = ?",
      [question_id]
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Likes count successfully Decremented" });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Expected Error Occurred" });
  }
}
async function oldestQuestions(req, res) {
  try {
    // Using JOIN to get questions with usernames in a single query
    const [questions] = await db.query(`
      SELECT 
        q.question_id,
        q.title,
        q.description AS content,
        q.created_at,
        q.tag,
        q.likes,
        q.dislike AS disLikes,
        r.username AS user_name,
        IFNULL(r.username, 'Unknown User') AS user_name
      FROM 
        questions q
      LEFT JOIN 
        registration r ON q.user_id = r.user_id
      ORDER BY 
        q.id
    `);

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No Question Found" });
    }

    // Map the results to your desired format
    const allQuestions = questions.map((question) => ({
      question_id: question.question_id,
      title: question.title,
      content: question.content,
      user_name: question.user_name,
      created_at: question.created_at,
      tag: question.tag,
      likes: question.likes,
      dislike: question.disLikes,
    }));

    return res.status(StatusCodes.OK).json({ questions: allQuestions });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Unexpected Error Occurred" });
  }
}
async function likedQuestions(req, res) {
  try {
    // Using JOIN to get questions with usernames in a single query
    const [questions] = await db.query(`
      SELECT 
        q.question_id,
        q.title,
        q.description AS content,
        q.created_at,
        q.tag,
        q.likes,
        q.dislike AS disLikes,
        r.username AS user_name,
        IFNULL(r.username, 'Unknown User') AS user_name
      FROM 
        questions q
      LEFT JOIN 
        registration r ON q.user_id = r.user_id
      ORDER BY 
        q.likes DESC
    `);

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No Question Found" });
    }

    // Map the results to your desired format
    const allQuestions = questions.map((question) => ({
      question_id: question.question_id,
      title: question.title,
      content: question.content,
      user_name: question.user_name,
      created_at: question.created_at,
      tag: question.tag,
      likes: question.likes,
      dislike: question.disLikes,
    }));

    return res.status(StatusCodes.OK).json({ questions: allQuestions });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An Unexpected Error Occurred" });
  }
}
module.exports = {
  allQuestions,
  postQuestion,
  singleQuestion,
  likeQuestion,
  disLikeQuestion,
  oldestQuestions,
  likedQuestions,
};
