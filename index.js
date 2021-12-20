const { Octokit } = require('@octokit/core')
let octokit

async function getLatestRelease(repo) {
    const release = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
        owner: 'APISuite',
        repo,
    })
    return {
        repo,
        tag: release.data.tag_name,
    }
}

async function printReleases() {
    const releases = await Promise.all([
        getLatestRelease('apisuite-be'),
        getLatestRelease('apisuite-fe'),
        getLatestRelease('apisuite-billing-extension'),
        getLatestRelease('apisuite-billing-extension-ui'),
        getLatestRelease('apisuite-marketplace-extension'),
        getLatestRelease('apisuite-marketplace-extension-ui'),
        getLatestRelease('apisuite-cloud-extension'),
        getLatestRelease('apisuite-cloud-extension-ui'),
    ])

    for (const r of releases) {
        console.log(r.repo, r.tag)
    }
}

async function run() {
    try {
        if (!process.env.PAT) {
            console.log('Missing personal access token in env var PAT')
            process.exit(1)
        }

        octokit = new Octokit({ auth: process.env.PAT });

        await printReleases()
    } catch(err) {
        console.error(err)
    }
}

run()