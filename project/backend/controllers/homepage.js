

async function gethomepage(req,res){
    const userId = req.cookies.userId;
    const loginRequired = !userId; 
    
    
    res.render('homepage', { userId: userId, loginRequired: !userId }); 
}



module.exports={
    gethomepage,
};