// Starts the published entry point and checks that it speaks MCP on stdio.
import { test } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('../bin/pgyer-mcp-server.js', import.meta.url));

test('serves the PGYER tools over stdio', async () => {
  const home = mkdtempSync(path.join(tmpdir(), 'pgyer-mcp-server-'));
  const child = spawn(process.execPath, [bin], {
    env: { ...process.env, HOME: home, USERPROFILE: home, PGYER_API_KEY: '' },
  });
  let stdout = '';
  let stderr = '';
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const responses = new Map();
  const waitFor = (id) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`no response ${id}: ${stderr}`)), 20_000);
    const check = () => {
      for (const line of stdout.split('\n').filter(Boolean)) {
        const message = JSON.parse(line);
        assert.strictEqual(message.jsonrpc, '2.0');
        if (message.id !== undefined) responses.set(message.id, message);
      }
      if (responses.has(id)) {
        clearTimeout(timer);
        resolve(responses.get(id));
      }
    };
    child.stdout.on('data', (chunk) => { stdout += chunk; check(); });
    check();
  });
  const send = (message) => child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`);

  try {
    send({ id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '1' } } });
    const init = await waitFor(1);
    assert.strictEqual(init.result.serverInfo.name, 'pgyer');
    send({ method: 'notifications/initialized' });
    send({ id: 2, method: 'tools/list' });
    const list = await waitFor(2);
    assert.deepStrictEqual(list.result.tools.map((tool) => tool.name).sort(), [
      'get_app',
      'get_upload_status',
      'list_apps',
      'list_versions',
      'set_latest_version',
      'update_app_settings',
      'upload_app',
    ]);
    send({ id: 3, method: 'tools/call', params: { name: 'list_apps', arguments: {} } });
    const call = await waitFor(3);
    assert.strictEqual(call.result.isError, true);
    assert.match(call.result.content[0].text, /PGYER_API_KEY/);
  } finally {
    child.stdin.end();
    await new Promise((resolve) => child.on('close', resolve));
    rmSync(home, { recursive: true, force: true });
  }
});
