const sequelize = require("../db");
const { Op } = require("sequelize");
const { Progress, Professional, Patient } = require("../models");

async function fetchAllProgress(patientId) {
  try {
    const result = await Progress.findAll({
      where: {
        patientId,
      },
      include: [
        { model: Professional },
        { model: Patient }
      ],
      order: [["createdAt", "ASC"]] 
    });
    const patient = result[0].dataValues.patient.dataValues;
    const data = result.map((item) => {
      const { patient, ...rest } = item.dataValues;
      const professional = rest.professional.dataValues;
      return { ...rest, professional };
    });
    return { patient, data };
  } catch (err) {
    console.log("SQL Error: " + err);
    return false;
  }
}

async function findProgressByPatient(patientId, page, size) {
  const offset = (page - 1) * size;

  try {
    const result = await Progress.findAndCountAll({
      attributes: {
        exclude: ["patientId", "professionalId"],
      },
      where: {
        patientId,
      },
      include: [{ model: Professional }],
      order: [["createdAt", "DESC"]],
      limit: size,
      offset,
    });

    result.rows = result.rows.map((progress, index) => {
      progress.dataValues.professional =
        progress.dataValues.professional.dataValues;
      const title = result.count - offset - index;
      return { ...progress.dataValues, title };
    });

    const totalPages = Math.ceil(result.count / size);
    return { ...result, totalPages };
  } catch (err) {
    console.log("SQL Error: " + err);
    return false;
  }
}

async function createProgress(progress) {
  try {
    const result = await Progress.create(progress);
    return !!result;
  } catch (err) {
    console.log("SQL Error: " + err);
    return false;
  }
}

async function updateProgress(progressId, progress) {
  try {
    const result = await Progress.update(progress, {
      where: { id: progressId },
    });
    return !!result;
  } catch (err) {
    console.log("SQL Error: " + err);
    return false;
  }
}

module.exports = {
  fetchAllProgress,
  findProgressByPatient,
  createProgress,
  updateProgress,
};
