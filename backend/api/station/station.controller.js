const stationService = require('./station.service.js')

const logger = require('../../services/logger.service')

async function getStations(req, res) {
  try {
    logger.debug('Getting Stations')
    const filterBy = {
      txt: req.query.txt || ''
    }
    const stations = await stationService.query(filterBy)
    res.json(stations)
  } catch (err) {
    logger.error('Failed to get stations', err)
    res.status(500).send({ err: 'Failed to get stations' })
  }
}

async function getStationById(req, res) {
  try {
    const stationId = req.params.id
    const station = await stationService.getById(stationId)
    res.json(station)
  } catch (err) {
    logger.error('Failed to get station', err)
    res.status(500).send({ err: 'Failed to get station' })
  }
}

async function addStation(req, res) {
  const {loggedinUser} = req

  try {
    const station = req.body
    station.owner = loggedinUser
    const addedStation = await stationService.add(station)
    res.json(addedStation)
  } catch (err) {
    logger.error('Failed to add station', err)
    res.status(500).send({ err: 'Failed to add station' })
  }
}


async function updateStation(req, res) {
  try {
    const station = req.body
    const updatedStation = await stationService.update(station)
    res.json(updatedStation)
  } catch (err) {
    logger.error('Failed to update station', err)
    res.status(500).send({ err: 'Failed to update station' })

  }
}

async function removeStation(req, res) {
  try {
    const stationId = req.params.id
    const removedId = await stationService.remove(stationId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove station', err)
    res.status(500).send({ err: 'Failed to remove station' })
  }
}

async function addStationMsg(req, res) {
  const {loggedinUser} = req
  try {
    const stationId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await stationService.addStationMsg(stationId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update station', err)
    res.status(500).send({ err: 'Failed to update station' })

  }
}

async function removeStationMsg(req, res) {
  const {loggedinUser} = req
  try {
    const stationId = req.params.id
    const {msgId} = req.params

    const removedId = await stationService.removeStationMsg(stationId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove station msg', err)
    res.status(500).send({ err: 'Failed to remove station msg' })

  }
}

module.exports = {
  getStations,
  getStationById,
  addStation,
  updateStation,
  removeStation,
  addStationMsg,
  removeStationMsg
}
