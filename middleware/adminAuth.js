const isLogin=async(req,res)=>{
    try{
        if(req.session.user_id){}
        else{
            res.redirect('/dashboard')
        }
        next();

    }catch(error){
        console.log(error)
    }
}

module.exports={
    isLogin
}

