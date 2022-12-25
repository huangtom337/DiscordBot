const cityInput = async (interaction, message) => {
  const filter = (m) => m.author.id === message.author.id;

  await interaction.followUp({
    content: 'Enter your city',
    ephemeral: true,
  });

  const msgs = await message.channel
    .awaitMessages({
      filter,
      max: 1,
      time: 10000,
      error: ['time'],
    })
    .catch(() => null);

  return msgs ? msgs.first().content : null;
};

const locationInput = async (interaction, client) => {
  let region = '';
  let city = '';

  await new Promise(async (resolve) => {
    await interaction.reply({
      content: 'Enter your province code (should be two letters)',
      ephemeral: true,
    });
    client.once('messageCreate', async (message) => {
      if (message.author.bot) return;

      region = message.content;
      city = await cityInput(interaction, message);

      if (!city) {
        throw Error('please restart');
      }

      resolve();
    });
  });

  return [region, city];
};

module.exports = locationInput;
