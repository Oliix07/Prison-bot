const Discord = require("discord.js");
const token = require("./token.json");
const fs = require("fs");
const bdd = require("./bdd.json");

const bot = new Discord.Client();

bot.on("ready", async () => {
    console.log("Le bot est allumé")
    bot.user.setStatus("dnd");
    setTimeout(() => {
        bot.user.setActivity("Avec la vie des prisonniers...", {type:'PLAYING'});
    }, 100)
});

bot.on("guildMemberAdd", member => {
    
    if(bdd["message-bienvenue"]){
        bot.channels.cache.get('719496807650164789').send(bdd["message-bienvenue"]);
    }
    else{
        bot.channels.cache.get('719496807650164789').send(`Bienvenue en prison ${member.user}`);
    }
    member.roles.add('719495589523488838');
})







    bot.on("guildMemberRemove", member => {
    
        if(bdd["message-aurevoir"]){
            bot.channels.cache.get('719496837199036426').send(bdd["message-aurevoir"]);
        }
        else{
            bot.channels.cache.get('719496837199036426').send(`${member.user} est partie ....`);
        }

})



bot.on("message", async message => {

    if (message.author.bot) return;

    if (message.content.startsWith("-clear")) {
        // message.delete();
        if (message.member.hasPermission('MANAGE_MESSAGES')) {

            let args = message.content.trim().split(/ +/g);

            if (args[1]) {
                if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99) {

                    message.channel.bulkDelete(args[1])
                    message.channel.send(`Vous avez supprimé ${args[1]} message(s)`)
                    message.channel.bulkDelete(1)

                }
                else {
                    message.channel.send(`Vous devez indiquer une valeur entre 1 et 99 !`)
                }
            }
            else {
                message.channel.send(`Vous devez indiquer un nombre de messages a supprimer !`)
            }
        }
        else {
            message.channel.send(`Vous devez avoir la permission de gérer les messages pour éxécuter cette commande !`)
        }
    }

    if (message.content.startsWith("-mb")) {
        message.delete()
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            if (message.content.length > 5) {
                message_bienvenue = message.content.slice(4)
                bdd["message-bienvenue"] = message_bienvenue
                Savebdd()

            }
        }
    }
    if (message.content.startsWith("-warn")) {
        if (message.member.hasPermission('BAN_MEMBERS')) {

            if (!message.mentions.users.first()) return;
            utilisateur = message.mentions.users.first().id

            if (bdd["warn"][utilisateur] == 2) {

                delete bdd["warn"][utilisateur]
                message.guild.members.ban(utilisateur)

            }
            else {
                if (!bdd["warn"][utilisateur]) {
                    bdd["warn"][utilisateur] = 1
                    Savebdd();
                    message.channel.send("Tu as a présent " + bdd["warn"][utilisateur] + " avertissement(s)");
                }
                else {
                    bdd["warn"][utilisateur]++
                    Savebdd();
                    message.channel.send("Tu as a présent " + bdd["warn"][utilisateur] + " avertissements");

                }
            }
        }
    }
    // commande de stats
    if (message.content.startsWith("-stats")) {
        let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
        let totalmembers = message.guild.members.cache.size;
        let totalservers = bot.guilds.cache.size;
        let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
        let totalrole = message.guild.roles.cache.get('719495589523488838').members.map(member => member.user.tag).length;

        const monembed = new Discord.MessageEmbed()
            .setColor('#FFFFFA')
            .setTitle('Statistiques')
            .setURL('https://discord.js.org/')
            .setAuthor('Projet LD Bot', 'https://media.discordapp.net/attachments/719490537551560754/719490850798829638/prison-d7f96423c0e1ee1b55c455b9266cf9d28a3d17a5-s6-c30.png', 'https://discord.js.org')
            .setDescription('Voici les statistiques du serveur :')
            .setThumbnail('https://media.discordapp.net/attachments/719490537551560754/719490850798829638/prison-d7f96423c0e1ee1b55c455b9266cf9d28a3d17a5-s6-c30.png')
            .addFields(
                { name: 'Nombre de prisonniers total', value: totalmembers, inline: true },
                { name: 'prisonniers en cellules : ', value: onlines, inline: true },
                { name: 'Nombre de serveurs auquel le bot appartient : ', value: totalservers, inline: true },
                { name: 'Nombres de bots sur le serveur : ', value: totalbots, inline: true },
                { name: 'Nombre d\'arrivants : ', value: totalrole, inline: true },
            )
            .setImage('https://media.discordapp.net/attachments/719490537551560754/719490850798829638/prison-d7f96423c0e1ee1b55c455b9266cf9d28a3d17a5-s6-c30.png')
            .setTimestamp()
            .setFooter('Some footer text here', 'https://media.discordapp.net/attachments/719490537551560754/719490850798829638/prison-d7f96423c0e1ee1b55c455b9266cf9d28a3d17a5-s6-c30.png');

        message.channel.send(monembed);
    }


    if (message.content.startsWith("*help")) {
        let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
        let totalmembers = message.guild.members.cache.size;
        let totalservers = bot.guilds.cache.size;
        let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
        let totalrole = message.guild.roles.cache.get('719495589523488838').members.map(member => member.user.tag).length;

        const monembed = new Discord.MessageEmbed()
            .setColor('#FFFFFA')
            .setTitle('Help')
            .setURL('https://discord.js.org/')
            .setAuthor('Prison OKLM', 'https://i.skyrock.net/5936/20765936/pics/593804550.jpg', 'https://discord.js.org')
            .setDescription('Voici les commandes : ')
            .setThumbnail('https://i.skyrock.net/5936/20765936/pics/593804550.jpg')
            .addFields(
                { name: 'mr-clear + nombre' },
                { name: 'mr-warn + ping ' },
                { name: 'mr-rank ' },
                { name: 'mr-stats ' },
                { name: 'mr-mb ' },
            )
            .setImage('https://i.skyrock.net/5936/20765936/pics/593804550.jpg')
            .setTimestamp()
            .setFooter('Bonne chances', 'https://cdn.discordapp.com/avatars/718503252190298172/ac2084a5b2395becbaad9d66f713379c.png?size=4096');

        message.channel.send(monembed);
    }


    
})
function addRandomInt(member) {
    bdd["coins-utilisateurs"][member.id] = bdd["coins-utilisateurs"][member.id] + Math.floor(Math.random() * (4 - 1) + 1);
    Savebdd();
}

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
  }

  /*bot.on("message", message => {
    if(message.content.startsWith("mr-help"))
    message.channel.send(`>    ===HELP===   \n> \n> Prefix : ***mr-*** \n> \n> ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ \n> \n> Commandes : \n> \n> 1) mr-clear + nombres \n> 2) mr-warn + ping (3 warns = ban pendant 1 jour)\n> 3) mr-rank\n> 4) mr-stats\n> 5) mr-mb  (juste pour mon developpeur)\n> 6 ??) une autre que je ne vous dirais pas !  .___.`)
})*/



bot.on("message", message => {
    if(message.content.startsWith("-createur"))
    message.channel.send(`Mon créateur est Oliix (Votre parrain a tous)`)
})


bot.on("message", message => {
    if(message.content.startsWith("-vent"))
    message.channel.send(`tu es méchant tu m'as mis un vent !!`)
});

bot.on("message", message => {
    if(message.content.startsWith("-code_223"))
    message.channel.send(`***3eme code trouvé***`)

});


bot.on("message", message => {
    if(message.content.startsWith("-code_678"))
    message.channel.send(`***2nd code trouvé***`)

});


bot.on("message", message => {
    if(message.content.startsWith("-code_788"))
    message.channel.send(`***1er code trouvé***`)

});

bot.on("message", message => {
    if(message.content.startsWith("-code_143")) 
    message.channel.send(`***Mauvais code***`)

});


bot.on("message", message => {
    if (message.content.startsWith("-code_452"))
    message.channel.send(`***Mauvais code***`)
});

bot.on("message", message => {
    if (message.content.startsWith("-code_668"))
    message.channel.send(`***Mauvais code***`)
});


bot.on("message", message => {
    if(message.content.startsWith("-code_123")) 
    message.channel.send(`***Mauvais code***`)

});


bot.on("message", message => {
    if (message.content.startsWith("-code_456"))
    message.channel.send(`***Mauvais code***`)
});

bot.on("message", message => {
    if (message.content.startsWith("-code_789"))
    message.channel.send(`***Mauvais code***`)
});

bot.on("message", message => {
    if(message.content.startsWith("-code_856")) 
    message.channel.send(`***Mauvais code***`)

});


bot.on("message", message => {
    if (message.content.startsWith("-code_261"))
    message.channel.send(`***Mauvais code***`)
});

bot.on("message", message => {
    if (message.content.startsWith("-code_749"))
    message.channel.send(`***Mauvais code***`)
});

bot.on("message", message => {
    if (message.content.startsWith("-code_223678788"))
    message.channel.send(`***porte dévérouillé***`)
});


bot.on("message", message => {
    if (message.content.startsWith("-sous-le-lit-1"))
    message.channel.send(`***Il n y a rien...***`)
});

bot.on("message", message => {
    if (message.content.startsWith("-derriere-le-lit-1"))
    message.channel.send(`***Il n y a rien...***`)
});


bot.on("message", message => {
    if (message.content.startsWith("-sur le mur"))
    message.channel.send(`***Il y a un code ! 678 ***`)
});

bot.on("message", message => {
    if (message.content.startsWith("-sous le lit"))
    message.channel.send(`***Il n y a rien...***`)
});

bot.on("message", message => {
    if (message.content.startsWith("-derriere-le-lit-2"))
    message.channel.send(`***Il y a un code ! 678***`)
});


bot.on("message", message => {
    if (message.content.startsWith("-sur-le-mur-2"))
    message.channel.send(`***Il n y a rien...***`)
});



//commande de recherche
bot.on("message", message => {
    if (message.content.startsWith("-rechercher autour"))
    message.channel.send(`*vous rechercher des endroits ou il pourrait y avoir un code... 
Il pourrait y avoir un code sur le mur ou sous le lit !*`)
});




//commande de dechiffrement
bot.on("message", message => {
    if (message.content.startsWith("-codecesar"))
    message.channel.send(`\`\`\` Le code César est une substitution monoalphabétique, c'est-à-dire qu'une même lettre n'est remplacée que par une seule autre (toujours identique).
     Le code César a la particularité d'être basé sur un décalage de l'alphabet.\n\n

    Alphabet clair    ABCDEFGHIJKLMNOPQRSTUVWXYZ\n
    Alphabet de César (+3)    DEFGHIJKLMNOPQRSTUVWXYZABC\n\n\n
    
    
    Exemple : Coder DCODEX avec un décalage de 3.\n
    Pour coder D, prendre l'alphabet et regarder trois lettres plus loin : il y a G. Donc D se code G.\n
    Pour coder X, boucler l'alphabet : après X, il y a Y, après Y, il y a Z et après Z, il y a A. Donc X se code A.\n
    DCODEX est chiffré GFRGHA \`\`\``)
});

bot.on("message", message => {
if (message.content.startsWith("-avatar")) {

    let mentionedUser = message.mentions.users.first() || message.author
    let embedavatar = new Discord.MessageEmbed()

    embedavatar.setColor('RANDOM')
    embedavatar.setTitle(`Servi sur un plateau d'argent !`)
    embedavatar.setFooter(`Avatar de ${mentionedUser.tag}`)
    embedavatar.setURL(mentionedUser.displayAvatarURL({size: 2048}))
    embedavatar.setImage(mentionedUser.displayAvatarURL({size: 2048}))

    message.channel.send(embedavatar)
}
});



bot.login(token.token);

