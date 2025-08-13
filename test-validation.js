const http = require('http');

// Test cases for validation
const testCases = [
    { name: 'Valid country', path: '/api/cities?country=india' },
    { name: 'Empty country', path: '/api/cities?country=' },
    { name: 'Missing country', path: '/api/cities' },
    { name: 'Country with numbers', path: '/api/cities?country=india123' },
    { name: 'Country with special chars', path: '/api/cities?country=india@#$' },
    { name: 'Very short country', path: '/api/cities?country=a' },
    { name: 'Very long country', path: '/api/cities?country=' + 'a'.repeat(60) },
    { name: 'Country with spaces', path: '/api/cities?country=united%20states' },
    { name: 'Country with mixed case', path: '/api/cities?country=InDiA' }
];

function testEndpoint(path, testName) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        testName,
                        status: res.statusCode,
                        success: res.statusCode === 200,
                        data: jsonData
                    });
                } catch (e) {
                    resolve({
                        testName,
                        status: res.statusCode,
                        success: false,
                        error: 'Invalid JSON response'
                    });
                }
            });
        });

        req.on('error', (e) => {
            resolve({
                testName,
                status: 'ERROR',
                success: false,
                error: e.message
            });
        });

        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing Cities API Validation...\n');

    for (const testCase of testCases) {
        const result = await testEndpoint(testCase.path, testCase.name);

        console.log(`📋 ${result.testName}:`);
        console.log(`   Status: ${result.status}`);
        console.log(`   Success: ${result.success ? '✅' : '❌'}`);

        if (result.error) {
            console.log(`   Error: ${result.error}`);
        } else if (result.data) {
            if (result.data.cities) {
                console.log(`   Cities found: ${result.data.total}`);
            } else if (result.data.message) {
                console.log(`   Message: ${result.data.message}`);
            }
        }
        console.log('');
    }
}

// Run tests
runTests();
