const GITHUB_API = 'https://api.github.com'

interface CommitFileOptions {
  owner: string
  repo: string
  path: string
  content: string
  message: string
  token: string
}

export async function commitFileToGitHub({ owner, repo, path, content, message, token }: CommitFileOptions) {
  // Get current file SHA (needed for updates)
  let sha: string | undefined

  try {
    const getRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    if (getRes.ok) {
      const data = await getRes.json()
      sha = data.sha
    }
  } catch { /* New file, no SHA needed */ }

  // Commit (create or update)
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content).toString('base64'),
  }
  if (sha) body.sha = sha

  const putRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify(body),
  })

  if (!putRes.ok) {
    const err = await putRes.json()
    throw new Error(`GitHub commit failed: ${err.message}`)
  }

  return putRes.json()
}

export function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO

  if (!token || !owner || !repo) {
    throw new Error('Missing GitHub environment variables: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO')
  }

  return { token, owner, repo }
}
