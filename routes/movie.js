const e = require("express");
const express = require("express");
const router = express.Router();
const pool = require("../config.js");
const{authorization} = require("../middlewares/auth.js");
const DEFAULT_LIMIT= 10;
const DEFAULT_PAGE = 1;


router.get("/movie", (req, res, next) => {
    console.log(req.query)
    const {limit, page} = req.query;


    let resultLimit = limit ?limit : DEFAULT_LIMIT;
    let resultPage = page ? page : DEFAULT_PAGE;

    console.log(resultLimit, resultPage);
    const findQuery = `
        SELECT
        *
        FROM movies
        ORDER BY movie.id
        LIMIT ${resultLimit} OFFSET ${(resultPage-1) * resultLimit}
    
    `
     pool.query(findQuery, (err, result) =>{
        if(err) next(err)

        res.status(200).json(result.rows);
     })
})

router.get("/movies/:id", (req, res, next) =>{

    const {id} = req.params;

    const findOneQuery = `
        SELECT
        *
        FROM movies
        WHERE movies.id = $1
    
    `

    pool.query(findOneQuery, [id], (err, result) => {
        if (err) next(err)

        if(result.rows.length === 0) {
            next({name: "ErrorNotFound"})

        } else {
            res.status(200).json(result.rows[0]);
        }
    })
})

router.post("/movie", (req, res, next) =>{
    const {title, genres, year} = req.body;
    
    const buatMovies = `
        INSERT INTO movies (title, genres, year)
            VAlUES
                ($1, $2, $3);
    
    `
    pool.query(buatMovies, [title, genres, year], (err, result) =>{
        if (err) next (err)

        res.status(200).json({
            message: "movie added successfully"
        })
    })
})

router.put("/movies/:id", (req, res, next) => {
    const {id} = req.params;
    const {title, genres, year} = req.body;

    const updateMovies =  `
        UPDATE movies
        SET title = $1,
            genres = $2,
            year = #3,
        WHERE movies.id = $4;
    
    `
    pool.query(updateMovies, [title, genres, year, id], (err, result) =>{
        if (err) next (err)

        res.status(200).json({
            message: "Updated successfully"
        })
    })
})

router.delete("/movies/:id", (req, res, next) =>{
    const {id} = req.params

    const deleteMovies = `
        DELETE FROM movies
        WHERE movies.id = $1;

    
    `
    pool.query(deleteMovies, [id], (err, result) => {
        if (err) next (err)
    })

    res.status(200).json({
        message: "movie was deleted"
    })

})



module.exports = router;