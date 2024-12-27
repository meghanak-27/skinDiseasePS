const Users=require('../models/login');


const postLogin = async (req, res) => {
    const userLog = req.body;

    const user = await Users.findOne({ userid: userLog.userid });

    if (!user) 
        return res.render("login", { error: "User not found. Please check your UserID." });
    const isPasswordValid = (userLog.pass==user.pass);
    if (!isPasswordValid) 
        return res.render("login", { error: "Incorrect password. Please try again." });
    
    res.cookie("userId", user._id, {
        httpOnly: true, 
        secure: false, // Set to true if using HTTPS
    });
    
    res.redirect('/upload');
    
    
       
};





module.exports= {postLogin};