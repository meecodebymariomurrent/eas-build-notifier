async function postJson(url, body, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(body),
            signal: controller.signal,
            redirect: 'error',
        });
        await response.body?.cancel();
    } catch {
        if (controller.signal.aborted) {
            throw new Error(`Notification request timed out after ${timeoutMs} ms`);
        }
        throw new Error('Notification request could not be completed');
    } finally {
        clearTimeout(timeout);
    }

    if (!response.ok) {
        throw new Error(`Notification request failed (HTTP ${response.status})`);
    }
}

module.exports = {postJson};
