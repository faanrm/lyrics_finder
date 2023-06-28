const searchSong = require('./searchSong');
const extractLyrics = require('./utils/extractLyrics');
const { checkOptions } = require('./utils');

/**
 * @param {{apiKey: string, title: string, artist: string, optimizeQuery: boolean}} options
 */
module.exports = async function (options) {
  try {
    checkOptions(options);
    let results = await searchSong(options);
    if (!results || results.length === 0) return [];

    let songs = [];

    // Display search results in a table-like format
    console.log("Search Results:");
    console.log("-------------------------------");
    console.log("|  #  |     Title              &        Artist   |");
    console.log("-------------------------------");
    results.forEach((song, index) => {
      console.log(`| ${index + 1}   | ${song.title.padEnd(20)} |`);
      songs.push({
        id: song.id,
        title: song.title,
        url: song.url,
        albumArt: song.albumArt,
        lyrics: null, 
      });
    });
    console.log("-------------------------------");

    
    // Prompt user to select a song
    const selectedSongIndex = await promptUser("Enter the number of the desired song: ");
    const selectedSong = results[selectedSongIndex - 1];

    let lyrics = await extractLyrics(selectedSong.url);
    return {
      id: selectedSong.id,
      title: selectedSong.title,
      url: selectedSong.url,
      lyrics,
      albumArt: selectedSong.albumArt
    };
  } catch (e) {
    throw e;
  }
};
function promptUser(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer); // Resolve the selected index as is
    });
  });
}
