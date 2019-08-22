// Deletes the ctf category names `ctf` and all children channels and corresponding roles

exports.run = async (client, message, [ctf, ...problems]) => {

    // Checks if at least one argument (the ctf name) was given
    if (!ctf)
	return message.reply("You must specify a CTF to create.").catch(console.error);

    const ctfname = ctf.toLowerCase();

    // Finds ctf category
    const ctfcat = message.guild.channels.find(channel => (channel.name.toLowerCase() === ctfname) && channel.type === 'category');

    // Return with error message if not found
    if (!ctfcat)
	return message.reply(`${ctfname} not found!`).catch(console.error);

    const response = await client.awaitReply(message, `Are you sure you want to permanently delete ${ctfname}? This **CANNOT** be undone.`);

    // If they respond with y or yes, continue.
    if (["y", "yes"].includes(response)) {


	let output = `- [category] ${ctfname}\n`;
	
	// For each channel of the category, delete the channel and corresponding role
	ctfcat.children.forEach(channel => {
	    let name = channel.name.startsWith('✅') ? channel.name.substr(1) : channel.name
	    let r = message.guild.roles.find(role => role.name === `${ctfname}-${name}`)
	    if (r)
		r.delete().catch(console.error);
	    channel.delete().then(output += `- [channel]  ${name}\n`).catch(console.error);
	});

	// Delete the category and send output
	ctfcat.delete().catch(console.error);
	message.channel.send(output, {code: 'diff'});
	
    } else {
	// If they respond with n or no, we inform them that the action has been cancelled.
	if (["n","no","cancel"].includes(response)) {
	    message.reply("Action cancelled.");
	}
    }

};

exports.conf = {
    dm: false,
    bot: true,
    permLevel: "Mod"
};

exports.help = {
    name: "deletectf",
    category: "CTF Mod",
    description: "Deletes CTF category and all channels under the category.",
    usage: "deletectf ctf"
};
