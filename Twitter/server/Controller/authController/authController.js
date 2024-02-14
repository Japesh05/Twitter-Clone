const pool = require("../../Database/db");
const query = require("../../queries");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "dsklajksd12323jsaldj";

const addUser = (req, res) => {
    const { email, password, username } = req.body;
    pool.query(query.findUser, [email], (err, result)=> {
        if(err) throw err;

        if(result.rows.length != 0){
           return res.json({
                status : "failed",
                code : 400,
                message : "Email already in use",
                token:""
            })
        }

        pool.query(query.addUser, [email, password, username], (err, result)=> {
            if(err) throw err;

            return res.json({
                status : "success",
                code : 200,
                message : "User added successfully",
                token : ""
            })
        })
    })
}

const loginUser = (req, res) => {
    const { email, password } = req.body;

    console.log("email: ", email);

    pool.query(query.findUser, [email], (err, result) => {
        if(err) throw err;

        if(result.rows.length === 0 || result.rows[0].password !== password){
            return res.json({
                status : "failed",
                code : 400,
                message : "Invalid Email or Password",
                token : ""
            })
        }

        const token = jwt.sign(email, SECRET_KEY);

        return res.json({
            status : "success",
            code : 200,
            message : result.rows,
            token
        })
    })
}

module.exports = { addUser, loginUser }