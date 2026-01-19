const http = require('http');

function request(path, options, callback) {
    const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: path,
        ...options
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => callback(res, data));
    });
    req.on('error', (e) => console.error(e));
    if (options.body) req.write(options.body);
    req.end();
}

console.log('--- Checking Headers ---');
request('/health', { method: 'GET' }, (res) => {
    console.log('X-DNS-Prefetch-Control:', res.headers['x-dns-prefetch-control']);
    console.log('X-Frame-Options:', res.headers['x-frame-options']);
    console.log('Strict-Transport-Security:', res.headers['strict-transport-security']);

    console.log('\n--- Checking Rate Limit (Login) ---');
    let count = 0;
    function hitLogin() {
        count++;
        request('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@test.com', password: 'wrong' })
        }, (res) => {
            console.log(`Attempt ${count}: Status ${res.statusCode}`);
            if (count < 6) hitLogin();
            else checkInjection();
        });
    }
    hitLogin();
});

function checkInjection() {
    console.log('\n--- Checking NoSQL Injection ---');
    // Note: If sanitized, keys starting with $ are removed.
    request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: { "$gt": "" }, password: 'password' })
    }, (res, data) => {
        console.log(`Injection Status: ${res.statusCode}`);
        console.log(`Response: ${data}`);
    });
}
