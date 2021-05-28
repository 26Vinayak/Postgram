const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../../config.js');
const {UserInputError} = require('apollo-server');
const {validateRegisterInput,validateLoginInput} = require('../../utils/validater.js');


function generateToken(user){
    return jwt.sign({
        id:user.id,
        email:user.email,
        username:user.username
    },SECRET_KEY,{expiresIn:'1h'});
}


module.exports = {
    Mutation:{
        async login(_,{username,password}){
            const {errors,valid} = validateLoginInput(username,password);
            const user = await User.findOne({username});
            if(!valid){
                throw new UserInputError('Errors',{errors});                    
            }
            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found',{errors});
            }
            const match = await bcrypt.compare(password,user.password);


            if(!match){
                errors.general = 'Wrong credentails';
                throw new UserInputError('Wrong credentails',{errors});    
            }


            const token = generateToken(user);
            return {
                ...user._doc,
                id:user._id,
                token
            };

        },
        async register(
            _,
            {
                registerInput:{username,email,password,confirmPassword}
            },
            context,info){
            //  validate user data
                const {valid,errors} = validateRegisterInput(username,email,password,confirmPassword);
                 if(!valid){
                     throw new UserInputError('Errors',{errors});
                 }
            
            //  Makes sure user doesnot already exists
                const user  = await User.findOne({username});
                if(user){
                    throw new UserInputError('Username is taken',{
                        errors:{
                            username:'This is username is taken'
                        }
                    });
                }
            //  hash password and create an auth token
            password = await bcrypt.hash(password,12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();
            const token = generateToken(res);
            return {
                ...res._doc,
                id:res._id,
                token
            };
        },
    }
}