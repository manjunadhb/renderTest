let mongoose = require("mongoose");
let express = require("express");
let cors = require("cors");
let multer = require("multer");
let jwt = require("jsonwebtoken");
let dotenv = require("dotenv");
let path = require("node:path");
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "./client/build")));

let authorise = (req, res, next) => {
  console.log("inside authorise");
  console.log(req.headers.authorization);
  next();
};

app.use(authorise);

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  mobileNo: String,
  profilePic: String,
});

let User = new mongoose.model("user", userSchema);

app.get("*", (req, res) => {
  res.sendFile(
    express.static(path.join(__dirname, "./client/build/index.html"))
  );
});

app.post("/register", upload.single("profilePic"), async (req, res) => {
  //console.log(req.file);
  //console.log(req.body);
  try {
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      password: req.body.password,
      mobileNo: req.body.mobileNo,
      profilePic: req.file.path,
    });

    await User.insertMany([newUser]);

    res.json({ status: "success", msg: "User Created successfully." });
  } catch (err) {
    res.json({ status: "failure", msg: "Unable to create user", err: err });
  }
});

app.post("/login", upload.none(), async (req, res) => {
  console.log(req.body);

  let userDetailsArr = await User.find().and({ email: req.body.email });

  if (userDetailsArr.length > 0) {
    if (userDetailsArr[0].password == req.body.password) {
      let encryptedCredentials = jwt.sign(
        {
          email: req.body.email,
          password: req.body.password,
        },
        "elections"
      );

      let loggedInUserDetails = {
        firstName: userDetailsArr[0].firstName,
        lastName: userDetailsArr[0].lastName,
        age: userDetailsArr[0].age,
        email: userDetailsArr[0].email,
        profilePic: userDetailsArr[0].profilePic,
        mobileNo: userDetailsArr[0].mobileNo,
        token: encryptedCredentials,
      };

      res.json({ status: "success", data: loggedInUserDetails });
    } else {
      res.json({ status: "failure", msg: "Invalid Password." });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist." });
  }
});

app.put("/updateUserDetails", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);

  try {
    if (req.body.firstName.trim().length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { firstName: req.body.firstName }
      );
    }

    if (req.body.lastName.trim().length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { lastName: req.body.lastName }
      );
    }

    if (req.body.age.trim().length > 0) {
      await User.updateMany({ email: req.body.email }, { age: req.body.age });
    }

    if (req.body.password.length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { password: req.body.password }
      );
    }

    if (req.body.mobileNo.trim().length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { mobileNo: req.body.mobileNo }
      );
    }

    if (req.file) {
      await User.updateMany(
        { email: req.body.email },
        { profilePic: req.file.path }
      );
    }

    res.json({ status: "success", msg: "Succesfully updated profile." });
  } catch (err) {
    res.json({ status: "failure", msg: "Unable to update profile", err: err });
  }
});

app.delete("/deleteAccount", upload.none(), async (req, res) => {
  console.log("deleteAccount");
  console.log(req.body);

  let result = await User.deleteMany({ email: req.body.email });

  console.log(result);

  if (result.acknowledged == true) {
    res.json({ status: "success", msg: "User Deleted Successfully." });
  } else {
    res.json({ status: "failure", msg: "Unable to delete user" });
  }
});

app.post("/validateToken", upload.none(), async (req, res) => {
  console.log(req.body.token);

  let decryptedCredentials = jwt.verify(req.body.token, "elections");
  console.log(decryptedCredentials);

  let userDetailsArr = await User.find().and({
    email: decryptedCredentials.email,
  });

  if (userDetailsArr.length > 0) {
    if (userDetailsArr[0].password == decryptedCredentials.password) {
      let loggedInUserDetails = {
        firstName: userDetailsArr[0].firstName,
        lastName: userDetailsArr[0].lastName,
        age: userDetailsArr[0].age,
        email: userDetailsArr[0].email,
        profilePic: userDetailsArr[0].profilePic,
      };

      res.json({ status: "success", data: loggedInUserDetails });
    } else {
      res.json({ status: "failure", msg: "Invalid Password." });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist." });
  }
});

app.listen(process.env.port, () => {
  console.log(`Listening to port ${4567}`);
});

let connectToMDB = async () => {
  try {
    await mongoose.connect(process.env.mdbURL);
    console.log("Connected to MDB Successfully");
  } catch (err) {
    console.log("Unable to connect to MDB");
  }
};

connectToMDB();
