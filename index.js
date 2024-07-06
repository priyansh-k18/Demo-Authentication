const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

main().catch(err => console.log('Oh no no damm it!!!'));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/authDmeo');
      console.log("Database connected")
}

app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'notagoodsecret',resave:true,saveUninitialized:true}));

const requireLogin = (req, res, next) => {
    if(!req.session.user_id){
       return res.redirect('/login')
    }
    next();

}

app.get('/', (req,res) => {
    res.send('WELCOME MY FRIEND WELCOME');
})

app.get('/register', (req,res) => {
    res.render('register');
})

app.post('/register',async (req, res) => {
      const {password, username} = req.body;
    //   const hash = await bcrypt.hash(password, 12);
    //   const user = new User({
    //      username,
    //      password: hash
    //   })
      const user = new User({username, password});
      await user.save();
      req.session.user_id = user._id;
      res.redirect('/');
})

app.get('/login',(req,res) => {
    res.render('login')
})

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const foundUser = await User.findAndValidate(username, password);
     const user = await User.findOne({username});
    //  if (user) {
    //     const validPassword = await bcrypt.compare(password, user.password);
        if (foundUser) {
             req.session.user_id = foundUser._id;
             res.redirect('/secret')
        } else {
            res.redirect('/login');
        }
    // } else {
    //     res.send("SOMETHING WRONG");
    // }
})

app.post('/logout',(req,res) => {
    // req.session.user_id = null;
    req.session.destroy();
    res.redirect('/login');
})
app.get('/secret', requireLogin, (req,res) => {
        res.render('secret');
})

app.get('/topsecret', requireLogin, (req,res) => {
    res.send("Top Secret!!!")
})

app.listen(8080, () => {
    console.log("SERVING YOUR APP!")
})
