const logger = require('../../services/logger.service')
const dbService = require('../../services/db.service')
const Youtube = require('youtube-stream-url');

async function query(term) {
    console.log(term);
    try {
        const criteria = {
            song_title: { $regex: term, $options: 'i' },
        }
        const collection = await dbService.getCollection('songs')
        var songs = await collection.find(criteria).toArray()
        if (!songs || !songs.length){
            songs = await fetchSongs(term)
         } 
        return songs
    } catch (err) {
        logger.error('cannot find songs', err)
        throw err
    }
}

async function fetchSongs(term) {
    console.log('Fetching from youtube');
    try{
        const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=AIzaSyCnH_-XZFUZfu4ATQaUyRrKuog3inohJME&q=${term}`;
        var songs = await fetch(YOUTUBE_API_URL).then(res => res.json()).then(data => data.items)
        if(!songs || !songs.length) return null
        songs = await Promise.all(songs.map(async (song) => {
            let songToSave = await saveSong(song)
            return songToSave
        }
        ))
        console.log('after save ',songs);
        // songs = await getSongs(songs)
        return songs
    }catch(err){
        logger.error('cannot fetch songs',err)
    }
}

async function saveSong(song){
    // {URL,ID,ARTIST,TITLE,COVER,LENGTH}
    try{
        let songToSave = {
            songId: song.id.videoId,
            song_title:song.snippet.title,
            song_cover:song.snippet.thumbnails.medium.url,
            publishedAt:song.snippet.publishedAt,
            song_artist:song.snippet.channelTitle
        } 
        songToSave = await add(songToSave)
        return songToSave
    }catch(err){
        logger.error('Cannot save song',err)
    }
}


async function add(song) {
    try {
        const collection = await dbService.getCollection('songs')
        const songToSave = await collection.findOne({ songId: song.songId })
        if(!songToSave){
            console.log('saving');
            await collection.insertOne(song)
        } 
        return song
    } catch (err) {
        logger.error('cannot insert car', err)
        throw err
    }
}

// async function getSongs(songs) {
//     try {
//         songs = songs.map(async (song) => {
//             if(!song.id) return
//             let songData = await Youtube.getInfo({ url: `https://www.youtube.com/watch?v=${song.id.videoId}` })
//             const regex = new RegExp('audio/webm', 'i');
//             songData.formats = songData.formats.filter(format => regex.test(format.mimeType))
//             let songToSave = {
//                 url: songData.formats[0].url,
//                 id: songData.videoDetails.videoId,
//                 song_artist: songData.videoDetails.author,
//                 song_cover: songData.videoDetails.thumbnail.thumbnails[0].url,
//                 song_title: songData.videoDetails.title
//             }
//              await add(songToSave)
//              return songToSave
//         })

//        return songs
//     } catch (err) {
//         console.log(err);
//     }
// }

module.exports = {
    query,
}
