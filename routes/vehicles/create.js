// MySQL DB Connection
const db = require('../../db')

// Filesystem connection
const fs = require('fs')
const path = require('path')
const uid_generator = require('uid-generator')
const uidgen = new uid_generator()

const create = (req, res) => {

    // Data is the user-submitted data
    let data = req.body;
    let uid = uidgen.generateSync()
    
    let vehicle = {
        uid: uid,
        author_id: res.locals.author_id,
        stock_code: data.stock_code,
        make: data.make,
        model: data.model,
        year: data.year,
        notes: data.notes
    }

    try{

        // 0. Check if all required parameters are present
        Object.values(vehicle).forEach(entry => {
            if(entry == undefined) throw [400, 'Missing one or more vehicle details']
        });

        let filepath = path.resolve('./../images/', uid)

        // 1. Create a directory for the vehicle's images
        fs.mkdirSync(filepath, { recursive:true })

        let query = 'INSERT INTO vehicles (u_id, author_id, make, model, year, image_path) VALUES (?,?,?,?,?,?)'

        // 2. Create new vehicle entry in the database
        db.query(query, [vehicle.uid, vehicle.author_id, vehicle.make, vehicle.model, vehicle.year, 'unused'], function (err, result) {
            if(err) throw err

            console.log(`[*] New vehicle inserted into the database!`)
        })

        return res.status(200).send(vehicle.uid)

    }catch(err){
        console.warn(err)
        return res.status(400).send(err)
    }
}

module.exports = create;
