# Releasing

`pgyer-mcp-server` starts the MCP server from `@pgyer/cli`, so a release has three steps, in this order.

## 1. Publish `@pgyer/cli`

In [PGYER/pgyer-cli](https://github.com/PGYER/pgyer-cli), merge the release into `main` and push a tag that matches `package.json`, for example `v0.2.0`. The `CI & Publish to npm` workflow tests, builds and publishes it with the `NPM_TOKEN` repository secret.

```bash
npm view @pgyer/cli version    # must show the version this package depends on
```

## 2. Publish `pgyer-mcp-server` to npm

Use an npm account that can publish this package (`npm owner ls pgyer-mcp-server`).

```bash
git checkout main && git pull
npm install
npm test                         # starts bin/pgyer-mcp-server.js against the published @pgyer/cli
npm publish --access public
npm view pgyer-mcp-server@2.0.0 mcpName   # must print io.github.PGYER/pgyer-mcp-server
```

The MCP Registry checks that `mcpName` in the published `package.json` matches `name` in `server.json`.

## 3. Publish to the MCP Registry

Keep `version` and `packages[0].version` in `server.json` equal to the npm version. Then, from the repository root:

Log in with a classic personal access token. The interactive `mcp-publisher login github` uses a
GitHub App that isn't installed on the PGYER organization, so the registry only sees your personal
namespace and `publish` fails with 403 ("You have permission to publish: io.github.<you>/*").

1. Create a classic token at https://github.com/settings/tokens/new as an owner of the PGYER
   organization, with only the `read:org` scope and a short expiry.
2. Publish:

   ```bash
   brew install mcp-publisher       # or download it from https://github.com/modelcontextprotocol/registry/releases
   mcp-publisher logout
   mcp-publisher login github --token <the classic token>
   mcp-publisher publish
   curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.PGYER/pgyer-mcp-server"
   ```

3. Delete the token at https://github.com/settings/tokens.

Only owners of the PGYER organization can publish names under `io.github.PGYER/`.
