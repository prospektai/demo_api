// MySQL DB Connection
const db = require('../../db')

// Filesystem connection
const fs = require('fs')

// For decoding the author_id
const jwt = require('jsonwebtoken')

const viewById = (req, res) => {

    let data = req.body;
    let uid = data.uid;

    try{
        // 0. Check if all required parameters are present
        if(uid == undefined) return res.status(404).send('UID not provided')

        // 1. Check if a vehicle with that UID exists
        db.query('SELECT * FROM vehicles WHERE u_id=?', uid, function (err, rows){
            if(err) throw err

            if(!rows.length) throw [404, 'Vehicle with provided UID not found']

            let vehicle = rows[0]

            // 2. If the vehicle exists, add the image base64 array
            // fs.readdir('images/' + uid + '/', function (err, files){
            //     if(err) throw err

            //     let photos;

            //     files.forEach(file => {
            //         let base64Img = fs.readFileSync('images/' + uid + '/' + file, { encoding: 'base64' }).toString()
            //         photos.push(base64Img)
            //     })

            //     console.log(photos)
            //     vehicle.push(photos)
            // })
        
            // TODO: refactor this code to only send out DB entries, not base64 images
            // (images will be handled by server) 

            // 3. Then send the whole array back to the client
            return res.status(200).send(vehicle)
        })
    }catch(err){
        console.warn(err)
        return res.status(400).send(err)
    }
}

const view = (req, res) => {

    let data = req.body;
    let author_id = jwt.decode(req.cookies.token).id

    try{
        // 0. Check if all required parameters are present
        if(author_id == undefined) throw [400, 'Author ID not defined']

        // 1. Check if any vehicle was created by the user with that id
        db.query('SELECT * FROM vehicles WHERE author_id=?', author_id, function (err, rows){
            if(err) throw err

            if(!rows.length) res.status(404).send('No vehicles found')

            // 2. If any vehicles were created, send all of the entries back to the client
            return res.status(200).send(rows)
        })
    }catch(err){
        console.warn(err)
        return res.status(400).send(err)
    }
}

module.exports = view;