async function authMiddleware (req, res, next)  {
    const userId = req.cookies.userId;

    if (!userId) {
        return res.status(401).render("login", { error: "Please log in to access this page." });
    }

    next(); // Allow access if authenticated
};

module.exports=authMiddleware