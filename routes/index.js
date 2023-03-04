const express = require("express")
const router = express.Router();
const movieRouter = require("./movie.js");
const pool = require("../config.js");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(5);
const jwt = require("jsonwebtoken");
const secretKey = "ADADEH"
const {authentication} = require("../middlewares/auth.js");

router.post("/login", (req, res, next) => {
    const {email, password} = req.body

    const findUser =`
         SELECT * FROM users
         WHERE email = $1
     `

     pool.query(findUser, [email], (err, result) => {
        if (err) next (err)

        if(result.rows.length === 0) {
            next({name: "ErrorNotFound"})
        } else {
            const data = result.rows[0]
            const comparePassword = bcrypt.compareSync(password, data.password);
            if(comparePassword) {
                const accesToken = jwt.sign({
                    id: data.id,
                    email: data.email,
                    password: data.password
                }, secretKey)

                res.status(200).json({
                    id: data.id,
                    email: data.email,
                    password: data.password,
                    accesToken: accesToken

                })

            }else {
                next({name: "wrongpassword"})
            }

        }
     })

})

router.post("/register", (req, res, next) =>{
    const {email, gender, password, role,} = req.body;

    const hash = bcrypt.hashSync(password, salt);

    const insertUser =`
        INSERT INTO users (email, gender, password, role)
            VALUES
            ($1, $2, $3, $4)

    
    `
    pool.query(insertUser,[email, gender, hash,role], (err, result) =>{
        if(err) next (err)
        res.status(201).json({
            message: "User Registered"
        });


    })
})

router.use(authentication)
router.use("/", movieRouter)

module.exports = router;
