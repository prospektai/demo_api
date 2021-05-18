// MySQL DB Connection
const db = require('../db')

// bcrypt for storing passwords
const bcrypt = require('bcrypt')
const saltRounds = 10

const register = (req, res) => {

    db.getConnection(function(err, conn){
        // Data is the user-submitted data
        let data = req.body;

        let user = {
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: data.password,
            mobile: data.mobile
        }

        try{
            // 0. Check if all required parameters are present
            Object.values(user).forEach(entry => {
                if(entry == undefined) throw [400, 'Missing one or more user details']
            });

            // 1. Check if the user isn't already registered
            db.query('SELECT * FROM users WHERE email=?', data.email, (err, rows) => {
                if(err) throw err

                if(rows.length){
                    console.warn('[*] User with email exists')
                    return res.status(401).send('A user with that email already exists')
                }

                // 2. If it's a new user, register them into the database
                bcrypt.hash(data.password, saltRounds, (err, hash) => {
                    if(err) throw err

                    let insert_query = 'INSERT INTO users (name, surname, email, hash, mobile_no) VALUES (?,?,?,?,?)'

                    db.query(insert_query, [data.name, data.surname, data.email, hash, data.mobile], function (err, rows) {
                        if(err) throw err

                        // 3. If all is successful, notify the client
                        return res.status(200).send(`User [${data.name}] with email [${data.email}] has been registered`)
                    })
                })
            })

        }catch(err){
            console.warn(err)
            return res.status(400).send(err)
        }
    })
}

module.exports = register;