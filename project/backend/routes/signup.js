const express=require('express');
const router=express.Router();

const {postSignup}=require('../controllers/signup');


router.get('/',(req,res)=>{
    return res.render("signup", { error: null });
});

router.post('/',postSignup);

module.exports=router;