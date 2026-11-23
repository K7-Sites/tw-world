import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
export async function openTestBrowser(t) {
  const profile = await mkdtemp(join(tmpdir(), "tw-review-test-"));
  const browser = spawn(
    process.env.TW_CHROME,
    [
      "--headless",
      "--disable-background-networking",
      "--no-first-run",
      "--remote-debugging-pipe",
      "--user-data-dir=" + profile,
    ],
    { windowsHide: true, stdio: ["ignore", "ignore", "ignore", "pipe", "pipe"] },
  );
  const closed = once(browser, "exit");
  t.after(async () => {
    browser.kill();
    await closed;
    await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  });

  // Chrome DevTools Protocol uses null-delimited JSON on the debugging pipe.
  let sequence = 0;
  const requests = new Map();
  let buffer = "";
  browser.stdio[4].setEncoding("utf8").on("data", (chunk) => {
    const messages = (buffer + chunk).split("\0");
    buffer = messages.pop();
    for (const raw of messages) {
      const message = JSON.parse(raw);
      requests.get(message.id)?.(message);
      requests.delete(message.id);
    }
  });
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++sequence;
      requests.set(id, (m) => (m.error ? reject(Error(m.error.message)) : resolve(m.result)));
      browser.stdio[3].write(JSON.stringify({ id, method, params, sessionId }) + "\0");
    });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const page = (method, params) => send(method, params, sessionId);
  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await page("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    assert.ok(!exceptionDetails, result.description);
    return result.value;
  };
  return { page, evaluate };
}
