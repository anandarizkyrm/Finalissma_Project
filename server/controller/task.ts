const { Classroom, Task, User, Student_Classroom } = require("../models");
const joi = require("@hapi/joi");

exports.createTask = async (req: any, res: any) => {
  try {
    const {
      classroom_id,
      user_id,
      answer_key,
      title,
      deadline,
      description,
      other,
    } = req.body;
    console.log(req.body);
    const schema = joi.object({
      classroom_id: joi.number().required(),
      user_id: joi.number().required(),
      answer_key: joi.string().required(),
      title: joi.string().required(),
      deadline: joi.string().required(),
      description: joi.string().required(),
      other: joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(500).send({
        status: 500,
        message: error.details[0].message,
      });
    }

    const checkClass = await Classroom.findOne({
      where: {
        id: classroom_id,
        teacher_id: user_id,
      },
    });
    if (!checkClass) {
      return res.status(500).send({
        status: 500,
        message: "id Invalid",
      });
    }

    const task = await Task.create({
      classroom_id,
      answer_key,
      title,
      deadline,
      description,
      other,
    });
    return res.status(200).send({
      status: 200,
      message: "Task created",
      data: task,
    });
  } catch (err: any) {
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

//considering coz security reason
exports.deleteTask = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: {
        id: id,
      },
    });

    if (!task) {
      return res.status(500).send({
        status: 500,
        message: "Task not found",
      });
    }
    await task.destroy();
    return res.status(200).send({
      status: 200,
      message: "Task deleted",
    });
  } catch (err: any) {
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

exports.editTask = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { answer_key, title, deadline, description, other } = req.body;
    const schema = joi.object({
      answer_key: joi.string().required(),
      title: joi.string().required(),
      deadline: joi.string().required(),
      description: joi.string().required(),
      other: joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(500).send({
        status: 500,
        message: error.details[0].message,
      });
    }

    const task = await Task.update(
      {
        answer_key,
        title,
        deadline,
        description,
        other,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return res.status(200).send({
      status: 200,
      message: "Task updated",
      data: task,
    });
  } catch (err: any) {
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};