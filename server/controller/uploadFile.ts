export{}
const path = require('path')
const multer = require('multer')
const express = require('express')


const storage = multer.diskStorage({
    destination(req : any, file : any, cb : any) {
      cb(null, 'file/')
    },
    filename(req : any, file : any, cb : any) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      )
    },
  })
  
  function checkFileType(file : any, cb : any) {
    const filetypes = /jpg|jpeg|png|pdf/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
  
    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb('File Type Not Supported!')
    }
  }
  
  const upload = multer({
    storage,
    fileFilter: function (req : any, file : any, cb : any) {
      checkFileType(file, cb)
    },
  })

const router = express.Router()

router.post('/fileupload', upload.single('file'), (req : any, res : any) => {
    try{
      console.log(req.file)
      res.send(`/${req.file.path}`)

    }catch(err :any){
      console.log(err)
      return res.status(500).send({message : err.message})
    }
})

module.exports = router


