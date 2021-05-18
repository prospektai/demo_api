// MySQL DB Connection
const db = require('../../db')

// Filesystem connection
const fs = require('fs')
const path = require('path')

const add_images = (req, res) => {

    // Data is the user-submitted data
    // Files are the provided files
    let data = req.body
    let photos = req.files['photos']
    let background = req.files['background']

    try{
        // 0. Check if the parameters were specified
        if(data.uid == null || photos == null || background == null){
            return res.status(400).send('Missing one or more of the required parameters')
        }

        if(photos.length < 1) return res.status(400).send('At least one image must be provided')
        if(photos.length > 35) return res.status(400).send('Exceeded 35 image limit')

        if(background.length < 1) return res.status(400).send('At least one background must be sent')

        // Set background if it was provided
        background = req.files['background'][0]
        let filePath = path.resolve('./../images/', data.uid)


        // 1. If a UID was specified, check if the relevant directory exists
        if(!fs.existsSync(filePath)){
            return res.status(404).send('The provided UID doesn\'t exist')
        }

        // 1.1. Check if there are 35 or more photos in the directory
        if(fs.readdirSync(filePath).length >= 35){
            return res.status(403).send('Picture upload limit reached (35 pictures)')
        }

        // 2. Save the images to the appropriate UID location
        photos.forEach((photo, i) => {

            // Write uploaded file from to upload directory
            fs.writeFile(path.resolve(filePath, `${i.toString()}.png`), photo.buffer, function (err) {
                if(err) throw err
            })
        })

        // 2.1. Save the background to the same directory
        fs.writeFile(path.resolve(filePath, 'background.png'), background.buffer, function (err) {
            if(err) throw err
        })

        console.log(`[*] ${photos.length} images written to ${filePath}`)
        return res.status(200).send(`${photos.length} images uploaded successfully`)
    }catch(e){
        console.log(e);
    }
}

module.exports = add_images;
