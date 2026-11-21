async function postJson(url, body, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        if (!response.ok) {
            const responseBody = await response.text();
            throw new Error(`Notification request failed (${response.status} ${response.statusText})${responseBody ? `: ${responseBody}` : ''}`);
        }
        return response;
    } finally {
        clearTimeout(timeout);
    }
}

module.exports = {postJson};
