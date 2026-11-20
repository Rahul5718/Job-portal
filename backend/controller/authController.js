const User = require('../models/user')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const Admin = require('../models/admin')

exports.registerUser = async (req,res)=>{

     const {name, email, password} = req.body

     if(!name || !email || !password){
          return res.status(400).json({
               message:"All fields are required"
          })
     }

     try{
         

           if (password.length < 6) {
               return res.status(400).json({
               message: "Password must contain at least 6 characters",
               });
          }

           const normalizedEmail = email.trim().toLowerCase()

          const existingUser  = await User.findByEmail(normalizedEmail)

          if(existingUser){
               return res.status(409).json({
                    message:"user already exists with this email try anothere email"
               })
          }

          const hashedPassword = await bcrypt.hash(password,10)

          const newUser = await User.create({
               name:name.trim(),
               email:normalizedEmail,
               password:hashedPassword,
               role:"candidate",
          })

           const token = jwt.sign(
            {
                userId: newUser.id,
                role: newUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );



          res.status(201).json({
               message:"user registered successfully",
               token,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
               },
          })


     }catch(err){
          res.status(500).json({
               message:"Server error"
          })
     }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const admin = await Admin.findByEmail(normalizedEmail);

    if (admin) {
      const isMatch = await bcrypt.compare(
        password,
        admin.password
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const token = jwt.sign(
        { userId: admin.id,
          role: "admin" 
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: "admin"
        }
      });
    }

    // If not admin, check the users collection
    const user = await User.findByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Candidate login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  }  catch (err) {
    console.error("Registration error:", err);

    return res.status(500).json({
        message: "Server error during registration"
    });
  }
}

