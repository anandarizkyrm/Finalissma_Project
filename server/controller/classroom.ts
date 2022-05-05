export {};
const joi = require("@hapi/joi");
const { User, Classroom, Student_Classroom, Task } = require("../models");
const makeClassCode = require("../utils/GenerateClassCode");
const Sequelize = require("sequelize");
const { cloudinary } = require("../utils/Cloudinary");

exports.createClassroom = async (req: any, res: any) => {
  try {
    const { name, teacher_id, description, banner } = req.body;

    //make sure the classcode is unique and not already exist

    let classcode = makeClassCode(6);
    async function CheckClassCode(classcode: String) {
      const classroom = await Classroom.findOne({
        where: { classcode: classcode },
      });

      if (classroom) {
        classcode = makeClassCode(6);
        CheckClassCode(classcode);
      }
    }

    CheckClassCode(classcode);

    ///////////////////////////////////////////////////////////////////

    // const schema = joi.object({
    //   name: joi.string().min(3).required(),
    //   teacher_id: joi.number(),
    //   description: joi.string().min(3).required(),
    //   banner: joi.string().min(3).required(),
    // });
    // const { error } = schema.validate(req.body);
    // if (error) {
    //   return res.status(500).send({
    //     status: 500,
    //     message: error.details[0].message,
    //   });
    // }
    const checkTeacherId = await User.findOne({
      where: {
        id: teacher_id,
      },
    });
    if (!checkTeacherId) {
      return res.status(500).send({
        status: 500,
        message: "Teacher Id not found",
      });
    }

    const classroom = await Classroom.create({
      classcode,

      description,
      name,
      teacher_id,
      banner,
    });
    return res.status(201).send({
      status: 201,
      message: "Classroom created",
      data: classroom,
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

exports.editClassroom = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, description, banner } = req.body;

    const schema = joi.object({
      name: joi.string().min(3).required(),
      description: joi.string().min(3).required(),
      banner: joi.string().min(3).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(500).send({
        status: 500,
        message: error.details[0].message,
      });
    }

    const classroom = await Classroom.findOne({
      where: {
        id: id,
      },
    });
    if (!classroom) {
      return res.status(500).send({
        status: 500,
        message: "Classroom not found",
      });
    }

    const updateClassroom = await Classroom.update(
      {
        name,
        description,
        banner,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return res.status(200).send({
      status: 200,
      message: "Classroom updated",
      data: updateClassroom,
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

exports.joinClassroom = async (req: any, res: any) => {
  const { id } = req.user;

  const { code } = req.body;

  try {
    const classroom = await Classroom.findOne({
      where: {
        classcode: code,
      },
    });
    if (!classroom) {
      return res.status(500).send({
        status: 500,
        message: "Classcode is not valid",
      });
    }
    const checkStudentId = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!checkStudentId) {
      return res.status(500).send({
        status: 500,
        message: "Student Id not found",
      });
    }

    const checkIfStudentIsInClassroom = await Student_Classroom.findOne({
      where: {
        student_id: id,
        classroom_id: classroom.id,
      },
    });
    if (checkIfStudentIsInClassroom) {
      return res.status(500).send({
        status: 500,
        message: "Sorry, You are already in this classroom",
      });
    }

    const joinClassroom = await Student_Classroom.create({
      student_id: id,
      classroom_id: classroom.id,
    });

    return res.status(201).send({
      status: 201,
      message: "You joined the classroom",
      data: joinClassroom,
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

exports.getStudentsInClassroom = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const findClassroom = await Classroom.findOne({
      where: {
        id: id,
      },
    });

    if (!findClassroom) {
      return res.status(500).send({
        status: 500,
        message: "Classroom not found",
      });
    }

    const students = await Student_Classroom.findAll({
      where: {
        classroom_id: id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "profile", "no_induk"],
        },
      ],
    });

    return res.status(200).send({
      status: 200,
      message: "Students in classroom",
      data: students,
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

exports.getTaskInClassroom = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findOne({
      where: {
        id: id,
      },
    });

    if (!classroom) {
      return res.status(500).send({
        status: 500,
        message: "Classroom not found",
      });
    }

    const task = await Task.findAll({
      where: {
        classroom_id: id,
      },
    });

    if (!task) {
      return res.status(200).send({
        status: 200,
        message: "No task in this classroom",
        data: task,
      });
    }

    return res.status(200).send({
      status: 200,
      message: "Task in classroom",
      data: task,
    });
  } catch (err: any) {
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};
exports.leaveClassroom = async (req: any, res: any) => {
  try {
    const { student_id, classroom_id } = req.body;

    const schema = joi.object({
      student_id: joi.number().required(),
      classroom_id: joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(500).send({
        status: 500,
        message: error.details[0].message,
      });
    }
    const checkStudentId = await User.findOne({
      where: {
        id: student_id,
      },
    });
    if (!checkStudentId) {
      return res.status(500).send({
        status: 500,
        message: "Student Id not found",
      });
    }
    const checkStudentClassroom = await Classroom.findOne({
      where: {
        id: classroom_id,
      },
    });
    if (!checkStudentClassroom) {
      return res.status(500).send({
        status: 500,
        message: "Classroom Id not found",
      });
    }

    const joinClassroom = await Student_Classroom.destroy({
      where: {
        student_id,
        classroom_id,
      },
    });

    return res.status(201).send({
      status: 201,
      message: "You left the classroom",
      data: joinClassroom,
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

exports.getClassroom = async (req: any, res: any) => {
  
  try{

    const { id } = req.params;

    const classroom = await Classroom.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "profile", "no_induk"],
        },
      ],
    });
    if (!classroom) {
      return res.status(500).send({
        status: 500,
        message: "Classroom not found",
      });
    }
    return res.status(200).send({
      status: 200,
      message: "Classroom found",
      data: classroom,
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

exports.getClassByUserId = async (req: any, res: any) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({
  
      where: {
        id: id,
      },
  
    });

    if (!user) {
      return res.status(500).send({
        status: 500,
        message: "User id not valid",
      });
    }

    const getClassById = await Student_Classroom.findAll({
      where: {
        student_id: id,
      },
      include: [
        {
          model: Classroom,
          attributes: ["id", "name", "banner", "description", "teacher_id", "classcode", "banner"],
        },
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!getClassById) {
      return res.status(200).send({
        status: 200,
        message: "you are not join any class yet",
      });
    }

    return res.status(200).send({
      status: 200,
      message: "Succesfully get the Class",
      class: getClassById,
    });
  } catch (err: any) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.getClassroomByTeacherId = async (req: any, res: any) => {
  
  try {
    

    //paginate
    const page = req.query.startIndex || 2;
    const limit = req.query.limit || 2;
  
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;


    const { id } = req.params;
    const teacher = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!teacher) {
  
      return res.status(500).send({
        status: 500,
        message: "User id not valid",
      });
  
    }

    const getClassroomByTeacherId = await Classroom.findAll({
  
      where: {
  
        teacher_id: id,
  
      },
      include: [
  
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      offset: startIndex,
      limit: endIndex
    });

    if (!getClassroomByTeacherId) {
  
      return res.status(200).send({
        status: 200,
        message: "you are not create any class yet",
      });
  
    }

    return res.status(200).send({
  
      status: 200,
      message: "Succesfully get the Class",
      class: getClassroomByTeacherId,
  
    });
  } catch (err: any) {
  
    res.status(500).send({
      message: err.message,
    });
  
  }
};

exports.deleteClassroom = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findOne({
      where: {
        id,
      },
    });

    if (!classroom) {
      return res.status(500).send({
        status: 500,
        message: "Classroom not found",
      });
    }

    const deleteClassroom = await Classroom.destroy({
      where: {
        id,
      },
    });

    return res.status(200).send({
      status: 200,
      message: "Classroom deleted",
      data: deleteClassroom,
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

// exports.searchClassroom = async (req: any, res: any) => {
//   try {
//     const { id } = req.params;
//     const { val } = req.query;
//     console.log(val);

//     const searchClassroom = await Classroom.findAll({
//       where: {
//         name: "%" + val + "%",
//       },
//       include: [
//         {
//           model: User,
//           attributes: ["id", "name", "email"],
//         },
//       ],
//     });

//     if (!searchClassroom) {
//       return res.status(200).send({
//         status: 200,
//         message: "Classroom not found",
//       });
//     }

//     return res.status(200).send({
//       status: 200,
//       message: "Succesfully get the Class",
//       class: searchClassroom,
//     });
//   } catch (err: any) {
//     res.status(500).send({
//       status: 500,
//       message: err.message,
//     });
//   }
// };

exports.searchClassroom = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { val } = req.query;

    const Op = Sequelize.Op;
    const searchClassroom = await Classroom.findAll({
      where: {
        name: {
          [Op.like]: "%" + val + "%",
        },
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
          // through: { where: { id: id } },
        },
      ],
    });

    if (!searchClassroom) {
      return res.status(200).send({
        status: 200,
        message: "Classroom not found",
      });
    }

    return res.status(200).send({
      status: 200,
      message: "Succesfully get the Class",
      class: searchClassroom,
    });
  } catch (err: any) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};
