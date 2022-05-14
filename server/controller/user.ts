export {};
const joi = require("@hapi/joi");
const { User } = require("../models");
const { cloudinary } = require("../utils/Cloudinary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.Register = async (req: any, res: any) => {
  try {
    const { name, phone, email, password, role, no_induk } = req.body;

    const schema = joi.object({
      name: joi.string().min(3).required(),
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
      phone: joi.string().min(12).required(),
      role: joi.string().min(4).required(),
      // profile: joi.string(),
      no_induk: joi.string().min(8).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(500).send({
        status: 500,
        message: error.details[0].message,
      });
    }

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.status(500).send({
        status: 500,
        message: "Email already exist",
      });
    }

    const saltRounds = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password: hash,
      phone,
      role,
      // profile,
      no_induk,
    });

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    res.status(200).send({
      status: 200,
      message: "User created successfully",
      data: {
        id: user.id,
        token,
        name,
        email,
        role,
        // profile,
        no_induk,
      },
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
      
    });
  }
};

exports.Login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const schema = joi.object({
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate(res.body);
    if (error) {
      res.status(500).send({
        status: 500,
        message: error.details[0].message,
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(500).send({
        status: 500,
        message: "Email or password is incorrect",
      });
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(500).send({
        status: 500,
        message: "Email or password is incorrect",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(200).send({
      status: 200,
      message: "Login successfully",
      data: {
        id: user.id,
        token,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
        no_induk: user.no_induk,
      },
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

exports.readAllUsers = async ({ req, res }: any) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).send({
      status: 200,
      message: "Get all users successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

exports.readUser = async (req: any, res: any) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    res.status(200).send({
      status: 200,
      message: "Get user successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

exports.editProfile = async (req: any, res: any) => {
  try {
    const { id } = req.user;
    const { name, email, profile } = req.body;

    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    if (profile) {
      const uploadResponse = await cloudinary.uploader.upload(profile, {
        upload_preset: "ml_default",
      });

      if (uploadResponse) {
        const updateProfile = await User.update(
          {
            profile: uploadResponse.url,
          },
          {
            where: {
              id: id,
            },
          }
        );
        if (!updateProfile) {
          return res.status(500).send({
            status: 500,
            message: "Update profile failed",
          });
        }

        return res.status(200).send({
          status: 200,
          message: "Profile updated successfully",
          data: {
            id: user.id,
            name,
            email,
            // phone,
            role: user.role,
            profile: uploadResponse.url,

            // no_induk,
          },
        });
      }
    }
    // const schema = joi.object({
    //   name: joi.string().min(3).required(),
    //   email: joi.string().email().min(10).required(),
    //   // phone: joi.string().min(12).required(),
    //   // no_induk: joi.string().min(8).required(),
    // });

    // const { error } = schema.validate(req.body);

    // if (error) {
    //   return res.status(500).send({
    //     status: 500,
    //     message: error.details[0].message,
    //   });
    // }

    const updateUser = await User.update(
      {
        name,
        email,
        // phone,
        // no_induk,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (!updateUser) {
      return res.status(500).send({
        status: 500,
        message: "Update failed",
      });
    }

    res.status(200).send({
      status: 200,
      message: "Update user successfully",
      data: {
        id: user.id,
        name,
        email,
        role: user.role,
        // phone,
        profile: user.profile,

        // no_induk,
      },
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};
