const songService = require('./song.service.js')
const Youtube = require('youtube-stream-url');

async function getSongById(req,res){
    try{
        let song = await Youtube.getInfo({url: `https://www.youtube.com/watch?v=${req.params.id}`})
        const regex = new RegExp('audio/webm','i');
        song.formats = song.formats.filter(format => regex.test(format.mimeType))
        res.json(song.formats[0].url)
    }catch(err){
        console.log(err);
    }
}

async function query(req,res){
    try{
        const { term } = req.params
        const songs = await songService.query(term)
        // let song = await Youtube.getInfo({url: `https://www.youtube.com/watch?v=${req.params.id}`})
        // const regex = new RegExp('audio/webm','i');
        // song.formats = song.formats.filter(format => regex.test(format.mimeType))
        res.json(songs)
    }catch(err){
        console.log(err);
    }
}


module.exports = {
    query,
    getSongById,
  }
  