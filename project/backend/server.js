const express=require('express')
const cookieparser=require('cookie-parser')

require('dotenv').config();
const {connectDB}=require('./connection.js');

const uploadRouter=require('./routes/upload');
const homepageRouter=require('./routes/homepage');
const loginRouter=require('./routes/login');
const signupRouter=require('./routes/signup');
const chatbotRouter=require('./routes/chatbot');
const auth=require('./middleware/auth.js');



const app=express();
const PORT=4000;

const path=require('path')

app.set('views', "./backend/ejsFiles");
app.set('view engine', 'ejs');


//mw for forms
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieparser());
app.use(express.static(path.join(__dirname, '../public')));


app.use('/',homepageRouter)
app.use('/login',loginRouter)
app.use('/signup',signupRouter);
app.use('/upload',cookieparser(),auth,uploadRouter);
app.use('/logout',(req,res)=>{
    res.clearCookie('userId', { path: '/' });
    res.redirect('/');
})
app.use('/ask-chatbot', chatbotRouter);

connectDB();


app.listen(PORT,()=>{
    console.log(`port started at ${PORT}`);
});