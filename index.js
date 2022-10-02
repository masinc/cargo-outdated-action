const core = require('@actions/core');
const github = require('@actions/github');

const process = require('node:process');
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);

async function main() {
    let pr;

    try {
        pr = await execFile('cargo', ['outdated', '-R', '--exit-code=1', '--color=always'])
    } catch {
        await fetch(process.env.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username: github.context.repo.repo,
                content: '```' + `${pr.stdout}` + '```'
            })
        })
    } finally {
        console.log(pr.stdout)
    }
}

main.catch(err => core.setFailed(err.message));
