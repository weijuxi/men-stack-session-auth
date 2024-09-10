const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");


router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }

    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    };
        
    res.redirect("/");
});

router.post("/sign-up", async (req, res) => {
    //console.log(req.body, "<-------------------req.body");// this will show the data that was sent from the form

    const userInDb = await User.findOne ({username: req.body.username});
    if (userInDb) {
        return res.send("User already exists");
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Passwords do not match");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const createdUser = await User.create(req.body);
    console.log(`User created: ${createdUser.username}`);
});

module.exports = router;