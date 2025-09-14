const sequelize = require('../db');
const { Op, col } = require('sequelize');
const Professional = require('../models/professional.js');

async function createProfessional( professional ) {
  try {
      const result = await Professional.create(professional)
      if(result && result.dataValues) {
          return result.dataValues.id
      } else {
          return false
      }
  } catch (err) {
      console.log("SQL Error: " + err)
      return false
  }
}

async function fetchAllProfessionals() {
  try {
      const professionals = await Professional.findAll()
      return professionals.map((prof) => prof.dataValues)
  } catch (err) {
      console.log("SQL Error: " + err)
      return null
  }
}

async function searchProfessionals( search, sorting, pagination = false ) {
  const where = search
    ? { name: { [Op.like]: `%${search}%` } }
    : {};
  try{
      const professionals = await Professional.findAndCountAll({
          where,
          order: [ [col(sorting.sortBy), sorting.sortDir] ],
          limit: pagination ? sorting.size : null,
          offset: pagination ? (sorting.page - 1) * sorting.size : null
      })
      return {
          professionals: professionals.rows.map((p) => p.dataValues),
          total: professionals.count
      }
  } catch (err) {
      console.log("SQL Error: "+err)
      return false
  }
}

async function updateProfessional( professionalId, professional ) {
  try {
      const result = await Professional.update(
          professional,
          { where: {id: professionalId} }
      )
      return !!result
  } catch (err) {
      console.log("SQL Error: "+err)
      return false
  }
}

async function deleteById( id ) {
  try {
      const result = await Patient.destroy({
          where: {
              id
          },
      });
      return result;
  } catch (err) {
      console.log("SQL Error: "+err)
      return false
  }
}

module.exports = { 
    createProfessional, 
    fetchAllProfessionals, 
    searchProfessionals, 
    updateProfessional,
    deleteById
}