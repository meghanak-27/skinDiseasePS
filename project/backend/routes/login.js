const express=require('express');
const router=express.Router();

const {postLogin}=require('../controllers/login')

router.get('/',(req,res)=>{
    return res.render("login");
});



router.post('/',postLogin);

module.exports=router;

