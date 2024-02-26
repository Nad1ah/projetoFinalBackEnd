const db = require("../db/mongodb");

async function validatePassword(pwd, hash) {
  const isValid = await bcrypt.compare(pwd, hash);
  if (!isValid) {
    await db
      .getDB()
      .collection(db.usersCollection)
      .updateOne(
        {
          _id: db.toMongoID(user._id),
        },
        {
          $inc: { failedLoginAttempts: 1 },
        }
      );
    return false;
  }

  await db
    .getDB()
    .collection(db.usersCollection)
    .updateOne(
      {
        _id: db.toMongoID(user._id),
      },
      {
        $set: { failedLoginAttempts: 0 },
      }
    );
  return true;
}

async function findUserByEmail(email) {
  try {
    const user = await db
      .getDB()
      .collection(db.usersCollection)
      .findOne({
        email: email,
        failedLoginAttempts: { $lt: 3 },
      });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
async function createPoll(pollData) {
  try {
    const result = await db
      .getDB()
      .collection(db.pollsCollection)
      .insertOne({
        question: pollData.question,
        options: pollData.options.map((option) => ({ option, votes: 0 })),
        expiresAt: pollData.expiresAt,
        createdAt: new Date(),
      });

    if (!result.insertedId) {
      return null;
    }

    return await getPollById(result.insertedId);
  } catch (error) {
    console.log(error);
    return null;
  }
}
async function vote(pollId, option) {
  const poll = await getPollById(pollId);
  if (!poll) {
    return null;
  }

  const now = new Date();
  if (now > poll.expiresAt) {
    return null;
  }

  const result = await db
    .getDB()
    .collection(db.pollsCollection)
    .updateOne(
      {
        _id: db.toMongoID(pollId),
        "options.option": option,
      },
      {
        $inc: { "options.$.votes": 1 },
      }
    );

  if (result.modifiedCount === 0) {
    return null;
  }

  return await getPollById(pollId);
}

async function signin(email, pwd) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await validatePassword(pwd, user.password, user);
  if (!isValid) {
    return null;
  }

  const token = generateAccessToken(user._id);
  return { token };
}
async function getPollById(pollId) {
  try {
    return await db
      .getDB()
      .collection(db.pollsCollection)
      .findOne({ _id: db.toMongoID(pollId) });
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getAllPolls() {
  try {
    return await db.getDB().collection(db.pollsCollection).find({}).toArray();
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function deletePollById(pollId) {
  try {
    const result = await db
      .getDB()
      .collection(db.pollsCollection)
      .deleteOne({ _id: db.toMongoID(pollId) });

    return result.deletedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getPollById,
  getAllPolls,
  deletePollById,
  signin,
  vote,
  createPoll,
};
