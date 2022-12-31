const { EmbedBuilder } = require('discord.js');

const mangaEmbedBuilder = ({
  name,
  url,
  siteName,
  newestChapterNumber = 0,
  mangaStatus = '',
  thumbnailImage = '',
}) => {
  const embed = new EmbedBuilder()
    .setColor(0xeaddca)
    .setTitle(name)
    .setURL(url)
    .setAuthor({
      name: `${siteName}`,
      url: `https://www.${siteName}.ca`,
      iconURL: 'https://i.imgur.com/AfFp7pu.png',
    })
    .setTimestamp();

  if (newestChapterNumber)
    embed.setDescription(`Newest Chapter is chapter ${newestChapterNumber}`);
  if (mangaStatus) embed.setTitle(`${name} (${mangaStatus})`);
  if (thumbnailImage) embed.setThumbnail(thumbnailImage);

  return embed;
};

module.exports = mangaEmbedBuilder;
