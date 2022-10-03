import process from 'node:process';
import child_process from 'node:child_process';
import path from 'node:path';

async function exec(cmds) {
    const [cmd, ...args] = cmds;

    return new Promise((resolve, reject) => {
        const spawn = child_process.spawn(cmd, args, {
            shell: process.platform === 'win32'
        });

        spawn.stdout.on('data', (chunk) => {
            process.stdout.write(chunk.toString());
        });

        spawn.stderr.on('data', (chunk) => {
            process.stderr.write(chunk.toString());
        })

        spawn.on('close', (code) => {
            if ((code ?? 0) === 0) {
                resolve()
            } else {
                reject(`error code: ${code}`);
            }
        });

        spawn.on('error', reject);
    })

}

async function main() {

    const repo = process.env['GITHUB_ACTION_REPOSITORY'];
    const repoUrl = process.env['GITHUB_SERVER_URL'] + '/' + repo;
    const dir = path.join('/tmp/', repo);
    const branch = 'main';

    await exec(['git', 'clone', '--depth=1', '--single-branch', '--branch', branch, repoUrl, dir]);
    process.chdir(dir);

    await exec(['npm', 'run', 'start']);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
