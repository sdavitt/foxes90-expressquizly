const mongoose = require('mongoose');

// create the plan for what a user looks like
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email."
            ]
        }
    },
    { timestamps: true }
);

// actually create and export the user model
module.exports = mongoose.model("user", userSchema);