const fs = require('fs');
const axios = require('axios').default;

class Color {
    constructor() {
        this.red = '\u001b[31;1m';
        this.green = '\u001b[32;1m';
        this.reset = '\u001b[37;1m';
    };

    design(color) {
        return ` ${this[color]}[${this.reset}>${this[color]}] `;
    };
};

class Bot extends Color {
    constructor() {
        super();
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
        console.log(this.design('green') + 'Checking Tokens...');

        if (!this.tokens.length || !this.ids.length) return console.error('No Tokens/Channels Found.');
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
            console.log(this.design('red') + `Invalid: ${y + this.reset} | ${this.green}Valid: ${x}`);
            console.log(this.design('green') + 'Completed Checking Tokens.');
        }, 1000);
    };

    spam(message, delay) {
        if (!this.valid.length || !this.ids.length) return console.error(this.design('green') + 'No Tokens/Channels Found.');

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
                        () => console.log(this.design('green') + 'Sent Message.')
                    ).catch(
                        () => console.log(this.design('red') + 'Unable to Send a Message')
                    );
                }, delay);
            });
        });
    };

    join(bot, invite) {
        if (bot == false) {
            this.tokens.forEach((token) => {
                axios({
                    method: 'POST',
                    url: `https://discord.com/api/v6/invite/${invite}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                }).then(
                    () => console.log(this.design('green') + 'A Token Joined Successfully')
                ).catch(
                    () => console.log(this.design('red') + 'Could Not Join The Server')
                )
            });
        };
    };

    init(message, delay, bot, invite) {
        console.log(`\n        ________          \n        \\______ \\   ______\n         |    |  \\ /  ___/\n         |    \`   \\\\___ \\ \n        /_______  /____  >\n                \\/     \\/ \n    ===========================\n`);
        process.stdout.write(`\x1b]2;` + 'endless OP' + `\x1b\x5c`);

        this.push(bot);
        this.join(bot, invite);
        this.check();

        setTimeout(() => {
            this.spam(message, delay);
        }, 1000);
    };
};

module.exports = {
    Bot: new Bot()
};
