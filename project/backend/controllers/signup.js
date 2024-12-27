const User=require('../models/login');



async function postSignup(req, res) {
    try {
        const newUser = req.body;

        // Check if `userid` or `email` already exists
        const existingUser = await User.findOne({
            $or: [{ userid: newUser.userid }, { email: newUser.email }],
        });

        if (existingUser) {
            // If user already exists, send an error response or render an error message
            return res.status(400).render('signup', { 
                error: 'User ID or Email already exists. Please use a different one.',
                input: newUser // Pass user input to populate form fields if needed
            });
        }

        // Create a new user if no duplicate found
        await User.create({
            name: newUser.name,
            email: newUser.email,
            userid: newUser.userid,
            pass: newUser.pass,
        });

        // Redirect to login page on success
        return res.render('login');
    } catch (error) {
        // Handle unexpected errors
        console.error('Error during signup:', error);
        return res.status(500).render('signup', { 
            error: 'An error occurred while processing your request. Please try again.',
        });
    }
}



module.exports={
    postSignup
}