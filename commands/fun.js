const { MessageEmbed } = require('discord.js');
const { hinaAsyncRequest } = require('../utils/general');
const { hinaColor} = require('../res/config');


module.exports = [

    {
        name: 'funfact',
        desciption: 'get a fun fact!',
        async execute(client, msg, args) {

            try {
                const fact = await hinaAsyncRequest('https://uselessfacts.jsph.pl/random.json?language=en');
                
                const embed = new MessageEmbed()
                    .setColor(hinaColor)
                    .setAuthor({name: 'Fun fact with Hina!', iconURL: client.user.displayAvatarURL()})
                    .setFooter({text: `Requested by: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL()})
                    .setTimestamp()
                    .setDescription(`
${fact.text.replace('`', '\\`')}

source: [here](${fact.source_url})
                    `)
                await msg.channel.send({ embeds: [embed] });
            }
            catch (err) {
                await msg.channel.send('Sorry, something went wrong went making the request. Please try again.')
                console.log(err);
            }
        }
    },



    {
        name: 'joke',
        desciption: 'I will tell you a joke.',
        async execute(client, msg, args) {

            try {
                let joke = await hinaAsyncRequest('https://v2.jokeapi.dev/joke/Any?blacklistFlags=religious,racist,sexist');
                let content;

                if (joke.type === 'single') { content = joke.joke }
                else { content = `${joke.setup.replace('`', '\\`')}\n||${joke.delivery.replace('`', '\\`')}||` };
                const embed = new MessageEmbed()
                    .setColor(hinaColor)
                    .setAuthor({name: `Joke (${joke.category})`, iconURL: client.user.displayAvatarURL()})
                    .setFooter({text: `Requested by: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL()})
                    .setTimestamp()
                    .setDescription(`${content}\n\n[source](https://v2.jokeapi.dev/)`)
                await msg.channel.send({ embeds: [embed] });

            }
            catch (err) {
                await msg.channel.send('Sorry, something went wrong went making the request. Please try again.')
                console.log(err);
            }
        }
    },



    {
        name: 'act',
        description: 'I will impersonate the user to say things.',
        async execute(client, msg, args) {

            if (args.length < 2) {
                await msg.channel.send('Please provide a user and a message');
                return;
            }
            let id = args.shift();
            id = id.match(/[0-9]+/);
            const userMsg = args.join(' ');

            try {
                const member = msg.mentions.members.first();
                
                const webhook = await msg.channel.createWebhook(member.displayName, {
                    avatar: member.displayAvatarURL({size: 4096})
                });

                await webhook.send(userMsg);
                await webhook.delete();
                await msg.delete();
                return;
            }
            catch (err) {
                console.log(err);
                await msg.channel.send('User is invalid or is not in the server!');
            };
        }
    }

]