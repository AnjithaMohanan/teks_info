
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const loadLogin = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}



const verifyLogin = async (req, res) => {
    try {
        const mobile = req.body.mno;
        const password = req.body.password;

        const userData = await User.findOne({ mobile: mobile });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render('login',{message:"Mobile and password is incorrect"})
                 
               
                } else {
                    req.session.user_id = userData._id;
                    res.redirect("/admin/home");
                   
                }
            } else {
                res.render('login', { message: 'Mobile and password are incorrect' });
            }
        } else {
            res.render('login', { message: 'Mobile and password are incorrect' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

const loadDashboard = async (req, res) => {
    try {
       const userData=await User.findById({_id:req.session.user_id})
        res.render('home',{admin:userData});
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}
const adminDashboard=async(req,res)=>{
    try{
       const userData= await User.find({is_admin:0})
        res.render('dashboard',{users:userData})

    }catch(error){
        console.log(error)
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    adminDashboard
};

