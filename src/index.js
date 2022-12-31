const client = require('./client.js');
const {
  runAtSpecificTimeOfDay,
  dailyScrapesEcommerce,
  dailyScrapesManga,
} = require('./scrapers/dailyScrapes.js');

const {
  handleChatCommands,
  handleReady,
  handleButtonCommand,
  handleVoiceCommands,
} = require('./controller/commandsController.js');

const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

// starting the bot
client.login(process.env.TOKEN);

client.on('ready', handleReady);

client.on('interactionCreate', handleChatCommands);

client.on('interactionCreate', handleButtonCommand);

client.on('voiceStateUpdate', handleVoiceCommands);
// periodically scrapes

runAtSpecificTimeOfDay(20, 00, () => {
  dailyScrapesEcommerce();
  dailyScrapesManga();
});

const runOnce = async () => {
  const url = 'http://www.youtube.com/watch?v=aqz-KE-bpKQ';
  let videoID = ytdl.getURLVideoID(url);

  // get mp4 from youtube
  // let info = await ytdl.getInfo(videoID);
  // let downloadOptions = {
  //   quality: 'highestaudio',
  //   requestOptions: { maxRedirects: 5 },
  //   format: ytdl.chooseFormat(info.formats, { quality: '134' }),
  // };
  // ytdl
  //   .downloadFromInfo(info, downloadOptions)
  //   .pipe(fs.createWriteStream('video.mp4'));

  // get mp3 from youtube
  // const stream = ytdl(url, { quality: 'highestaudio' });
  // let start = Date.now();
  // await new Promise((resolve, reject) => {
  //   ffmpeg(stream)
  //     .audioBitrate(128)
  //     .on('progress', (p) => {
  //       process.stdout.write(`${p.targetSize}kb downloaded`);
  //     })
  //     .on('end', () => {
  //       console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
  //     })
  //     .save(`${__dirname}/music/${videoID}.mp3`);

  //   resolve('finished');
  // });
};

runOnce();
