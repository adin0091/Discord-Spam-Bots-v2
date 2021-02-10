const fs = require('fs');
const axios = require('axios').default;

class Bot {
    constructor() {
        this.tokens = [];
        this.ids = [];
        this.valid = [];
        this.invalid = [];
    };

    push(bot) {
        try {
            fs.readFileSync('tokens.txt', 'utf-8').split(/\r?\n/).forEach(
                (token) => {
                    if (bot == false) this.tokens.push(token);
                    if (bot == true) this.tokens.push('Bot ' + token);
                }
            );
        } catch(e) {
            fs.writeFileSync('tokens.txt', 'Insert Multiple Tokens Here.');
        };
        
        try {
            fs.readFileSync('channel-ids.txt', 'utf-8').split(/\r?\n/).forEach(
                (id) => {
                    this.ids.push(id);
                }
            );
        } catch(e) {
            fs.writeFileSync('channel-ids.txt', 'Insert Channel IDs Here');
        };
    };

    check() {
        console.log('Checking Tokens...');

        if (!this.tokens.length || !this.ids.length) throw new Error('No Tokens/Channels Found.');
        let x = 0;
        let y = 0;

        this.tokens.forEach((token) => {
            axios({
                method: 'GET',
                url: 'https://discord.com/api/v7/users/@me',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }).then(
                () => {
                    x += 1;
                    this.valid.push(token);
                }
            ).catch(
                () => {
                    y += 1;
                    this.invalid.push(token);
                }
            );
        });

        setTimeout(() => {
            console.log(`Invalid: ${y} | Valid: ${x}`);
            console.log('Completed Checking Tokens.');
        }, 1000);
    };

    spam(message, delay) {
        setTimeout(() => {
            console.clear();
        }, 3000);

        this.tokens.forEach((token) => {
            this.ids.forEach((id) => {
                setInterval(() => {
                    axios({
                        method: 'POST',
                        url: `https://discord.com/api/v7/channels/${id}/messages`,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        },
                        data: {
                            'content': message
                        }
                    }).then(
                        () => console.log('Sent Message.')
                    ).catch(
                        () => console.log('Unable to Send a Message')
                    );
                }, delay);
            });
        });
    };

    init(message, delay, bot) {
        process.stdout.write(`\x1b]2;` + 'endless OP' + `\x1b\x5c`);

        this.push(bot);
        this.check();
        this.spam(message, delay);
    };
};

module.exports = {
    Bot: new Bot()
};
