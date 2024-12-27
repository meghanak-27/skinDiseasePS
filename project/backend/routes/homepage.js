const express=require('express')
const router=express.Router();

const {gethomepage}=require('../controllers/homepage')


router.get('/',gethomepage);

module.exports=router;