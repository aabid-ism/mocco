import conn from "../conn.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// function to generate jwt
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "30d" }); // token expires in 30 days
};

// <-------------------- SIGN IN -------------------->
export const signIn = async (req, res) => {
  try {
    let data = {
      name: req.body.firstName + " " + req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    };

    // getting references to database and collection
    const db = conn.getDb();
    const authorsCollection = await db.collection("authors");

    // verfify password
    const verifyPassword = async (plainPassword, hashedPassword) => {
      try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        if (isMatch) {
          // Password matches, perform additional actions if needed
          return true;
        } else {
          // Password does not match, handle the error or display an error message
          return false;
        }
      } catch (error) {
        console.error(error);
        // Error occurred during the password verification process, handle the error
      }
    };

    // finding and returning all news posts
    const result = await authorsCollection
      .find({ ["email"]: data.email })
      .toArray();

    if (result.length === 1) {
      try {
        //create a token
        const token = createToken(result[0]._id);
        const isValid = await verifyPassword(data.password, result[0].password);
        if (isValid) {
          res.status(200).json({
            message: "Author sign in successful",
            token: token,
            username: result[0].name,
          });
        } else {
          res.status(401).json({ message: "Invalid password" });
        }
      } catch (err) {
        // Error occurred during the password verification process, handle the error
        console.error(err);
      }
    } else {
      res.status(409).json({ message: "User unavailable, Sign Up" });
    }
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- SIGN IN -------------------->
export const signUp = async (req, res) => {
  try {
    let data = {
      name: req.body.firstName + " " + req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    };

    // getting references to database and collection
    const db = conn.getDb();
    const authorsCollection = await db.collection("authors");
    const exists = await authorsCollection
      .find({ ["email"]: data.email })
      .toArray();

    if (exists.length != 0) {
      res.status(409).json({ message: "Username already in use" });
    } else {
      // password hashing
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(data.password, salt);
      data = { ...data, password: hash };
      const result = await authorsCollection.insertOne(data);

      //create a token
      const token = createToken(result.insertedId);
      if (result.acknowledged) {
        res
          .status(200)
          .json({ message: "Author sign up successful", token: token });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
