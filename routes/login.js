// MySQL DB Connection
const db = require('../db')

// bcrypt for comparing passwords
const bcrypt = require('bcrypt')

// JWT for API authentication
// The JWT needs to be renewed every
// 900 seconds, or every 15 mins
require('dotenv').config()
const jwt = require('jsonwebtoken')
const jwt_key = process.env.JWT_KEY
const jwt_expire = 900

const login = (req, res) => {

    // Data is the user-submitted data
    let data = req.body;
    let email = data.email;

    try{
        // 0. Check that all required parameters were provided and the client isn't logged in
        if(email == undefined){
            throw [400, 'Missing one or more user details']
        }

        // 1. Check if user with the specified email exists and the passwords match
        db.query('SELECT * FROM users WHERE email=?', data.email, function(err, rows) {
            if(err) throw err

            if(!rows.length || rows[0].email.localeCompare(data.email) != 0) {
                return res.status(401).send('User not found')
            }

            bcrypt.compare(data.password, rows[0].hash.toString(), function (err, same) {
                if(err) throw err

                if(!same){
                    return res.status(401).send('Incorrect password')
                }

                let token = jwt.sign({email: email, id: rows[0].id}, jwt_key, {
                    algorithm: 'HS256',
                    expiresIn: jwt_expire
                })

                // console.log(`[*] Password matched for user [${data.email}] and password [${data.password}]`)
                // console.log(`[*] Generated token: [${token}] derived from key ${jwt_key}`)

                res.cookie('token', token, { maxAge: jwt_expire * 1000, httpOnly: true })
                return res.status(200).send('Logged in')
            })
        })
    }catch(err){
        console.warn(err)
        return res.status(400).send(err)
    }
}

const verifyJWT = (req, res, next) => {
    let token = req.cookies.token

    if(token == undefined) return res.status(401).send('Error: No token provided')

    try{
        let result = jwt.verify(token, jwt_key)
        
        console.log(`[*] JWT authorized for [${result.email}] with id [${result.id}]`)
        res.locals.author_id = result.id;
        
        next()
    }catch(err){
        if(err instanceof jwt.JsonWebTokenError){
            return res.status(401).send()
        }

        return res.status(400).send()
    }
}

const renewJWT = (req, res) => {
    let data = req.body
    let token = req.cookies.token
    let email = data.email

    if(token == undefined) return res.status(401).send('Error: No token provided')

    let result = undefined
    try{
        result = jwt.verify(token, jwt_key)
    }catch(err){
        if(err instanceof jwt.JsonWebTokenError){
            return res.status(401).send()
        }

        return res.status(400).send()
    }

    let unixSeconds = Math.round(Number(new Date()) / 1000)
    if(result.exp - unixSeconds > 30){
        return res.status(400).send('Token will be valid for more than 30 seconds')
    }

    let newToken = jwt.sign({ email }, jwt_key, {
        algorithm: 'HS256',
        expiresIn: jwt_expire
    })

    res.cookie('token', newToken, { maxAge: jwt_expire * 1000, httpOnly: true })
    console.log(`[*] JWT renewed for [${result.email}]`)
    return res.status(200).send('Token renewed')
}

module.exports = { login, verifyJWT, renewJWT }
