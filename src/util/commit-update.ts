import { SimpleGit } from 'simple-git/promise';

export async function commitUpdate(git: SimpleGit, today: string, time: string) {
    const isRepo = await git.checkIsRepo();

    if ( isRepo ) {
        await git.pull();
        await git.add('./*');
        await git.commit(`📈 Update at ${today} at ${time} by scraper`);
        await git.push([ '-u', 'origin', 'master' ].join(' '));
    }
}
