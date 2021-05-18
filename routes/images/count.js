const path = require('path')
const fs = require('fs')

const count_images = (req, res) => {
    let data = req.body;

    if(data.uid == (null || '')) return res.status(400).send('UID is missing')

    // 1. Build the path
    let dirPath = path.resolve('./../images/', data.uid)

    // 2. Check if the directory exists
    if(!fs.existsSync(dirPath)){
        return res.status(404).send('No such UID present on server')
    }

    // 3. Count and return the number of files in the directory
    let fileCount = fs.readdirSync(dirPath).length;
    return res.status(200).send(`${fileCount}`)
}

module.exports = count_images;