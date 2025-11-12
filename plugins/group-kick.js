const config = require('../config');
const { cmd } = require('../command');

cmd({
  pattern: "kick",
  alias: ["k", "💀"],
  desc: "Removes a participant by replying to or mentioning their message. (Admins can also be kicked)",
  react: "🚪",
  category: "group",
  filename: __filename,
}, async (conn, mek, m, {
    from,
    quoted,
    isGroup,
    isAdmins,
    isOwner,
    participants,
    isBotAdmins,
    reply
}) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        // Only admins or the owner can use this command
        if (!isAdmins && !isOwner) return reply("*📛 ᴏɴʟʏ ɢʀᴏᴜᴩ ᴀᴅᴍɪɴꜱ ᴏʀ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ*");
        // Check if the bot has admin privileges
        if (!isBotAdmins) return reply("*📛 ɪ ɴᴇᴇᴅ ᴛᴏ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴋɪᴄᴋ ᴍᴇᴍʙᴇʀꜱ.*");
        
        // Determine the target user using reply or mention
        let target;
        if (m.quoted) {
            target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
        } else if (m.msg && m.msg.contextInfo && m.msg.contextInfo.mentionedJid && m.msg.contextInfo.mentionedJid.length > 0) {
            target = m.msg.contextInfo.mentionedJid[0];
        }
        
        if (!target) {
            return reply("❌ ᴩʟᴇᴀꜱᴇ ᴍᴇɴᴛɪᴏɴ ᴏʀ ʀᴇᴩʟᴀʏ ᴛᴏ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴏꜰ ᴛʜᴇ ᴩᴀʀᴛɪᴄɪᴩᴀɴᴛ ᴛᴏ ʀᴇᴍᴏᴠᴇ.");
        }
        
        // Remove the participant from the group (admins can also be kicked)
        await conn.groupParticipantsUpdate(from, [target], "remove")
          .catch(err => {
              console.error(`⚠️ ꜰᴀɪʟᴇᴅ ᴛᴏ ʀᴇᴍᴏᴠᴇ ${target}:`, err);
              return reply("❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ ᴛʀʏɪɴɢ ᴛᴏ ʀᴇᴍᴏᴠᴇ ᴛʜᴇ ᴩᴀʀᴛɪᴄɪᴩᴀɴᴛ.");
          });
        
        // Extraire le tag à partir du JID (ex: "1234567890" sans "@s.whatsapp.net")
        const tag = target.split('@')[0];
        reply(`*@${tag} ᴋɪᴋᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ! 😂🦶*`, { mentions: [target] });
    } catch (error) {
        console.error('ᴇʀʀᴏʀ ᴡʜɪʟᴇ ᴇxᴇᴄᴜᴛɪɴɢ ᴋɪᴄᴋ:', error);
        reply('❌ ᴀɴ ᴇʀᴏʀʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ ᴇxᴄᴜᴛɪɴɢ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ.');
    }
});
