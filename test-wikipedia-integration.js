const http = require('http');

// Test cases for Wikipedia integration
const testCases = [
    {
        name: 'Test Poland (PL) - should include Wikipedia descriptions',
        path: '/api/cities?country=PL',
        expectedFeatures: ['pollutionDataAvailable', 'wikipediaDescriptions']
    },
    {
        name: 'Test India - should use local data with basic descriptions',
        path: '/api/cities?country=india',
        expectedFeatures: ['pollutionDataAvailable']
    }
];

function testEndpoint(path, testName, timeout = 120000) {
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
                        data: jsonData,
                        responseTime: Date.now()
                    });
                } catch (e) {
                    resolve({
                        testName,
                        status: res.statusCode,
                        success: false,
                        error: 'Invalid JSON response',
                        rawData: data
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

        req.setTimeout(timeout, () => {
            resolve({
                testName,
                status: 'TIMEOUT',
                success: false,
                error: `Request timeout (${timeout / 1000}s)`
            });
        });

        req.end();
    });
}

function analyzeResponse(data, expectedFeatures) {
    const analysis = {
        hasCities: false,
        citiesCount: 0,
        hasPollutionData: false,
        hasWikipediaDescriptions: false,
        pollutionDataAvailable: false,
        totalPages: 0,
        sortedBy: null,
        features: [],
        descriptionStats: {
            total: 0,
            withWikipedia: 0,
            withBasicDescription: 0,
            averageLength: 0
        }
    };

    if (data.cities && Array.isArray(data.cities)) {
        analysis.hasCities = true;
        analysis.citiesCount = data.cities.length;

        if (data.cities.length > 0) {
            // Analyze descriptions
            const descriptions = data.cities.map(city => city.description).filter(Boolean);
            analysis.descriptionStats.total = descriptions.length;

            descriptions.forEach(desc => {
                if (desc && desc !== 'Unknown' && desc !== 'Description unavailable' && desc !== 'No description available') {
                    analysis.hasWikipediaDescriptions = true;
                    analysis.descriptionStats.withWikipedia++;
                } else if (desc) {
                    analysis.descriptionStats.withBasicDescription++;
                }
            });

            // Calculate average description length
            if (descriptions.length > 0) {
                const totalLength = descriptions.reduce((sum, desc) => sum + desc.length, 0);
                analysis.descriptionStats.averageLength = Math.round(totalLength / descriptions.length);
            }

            // Check for pollution data
            data.cities.forEach(city => {
                if (city.pollution && city.pollution.aqi !== undefined) {
                    analysis.hasPollutionData = true;
                }
            });
        }
    }

    if (data.page !== undefined && data.limit !== undefined) {
        analysis.hasPagination = true;
        analysis.features.push('pagination');
    }

    if (data.pollutionDataAvailable !== undefined) {
        analysis.pollutionDataAvailable = data.pollutionDataAvailable;
        analysis.features.push('pollutionDataAvailable');
    }

    if (data.totalPages !== undefined) {
        analysis.totalPages = data.totalPages;
        analysis.features.push('totalPages');
    }

    if (data.sortedBy !== undefined) {
        analysis.sortedBy = data.sortedBy;
        analysis.features.push('sortedBy');
    }

    if (analysis.hasWikipediaDescriptions) {
        analysis.features.push('wikipediaDescriptions');
    }

    return analysis;
}

async function runTests() {
    console.log('📚 Testing Wikipedia Integration...\n');

    for (const testCase of testCases) {
        console.log(`📋 ${testCase.name}:`);

        const startTime = Date.now();
        const result = await testEndpoint(testCase.path, testCase.name);
        const responseTime = Date.now() - startTime;

        console.log(`   Status: ${result.status}`);
        console.log(`   Success: ${result.success ? '✅' : '❌'}`);
        console.log(`   Response Time: ${responseTime}ms`);

        if (result.error) {
            console.log(`   Error: ${result.error}`);
        } else if (result.data) {
            const analysis = analyzeResponse(result.data, testCase.expectedFeatures);

            console.log(`   Cities Found: ${analysis.citiesCount}`);
            console.log(`   External API Used: ${analysis.pollutionDataAvailable ? '✅' : '❌'}`);
            console.log(`   Has Pollution Data: ${analysis.hasPollutionData ? '✅' : '❌'}`);
            console.log(`   Has Wikipedia Descriptions: ${analysis.hasWikipediaDescriptions ? '✅' : '❌'}`);
            console.log(`   Total Pages Fetched: ${analysis.totalPages}`);
            console.log(`   Sorting Applied: ${analysis.sortedBy || 'None'}`);

            // Description statistics
            console.log(`   Description Stats:`);
            console.log(`     - Total descriptions: ${analysis.descriptionStats.total}`);
            console.log(`     - Wikipedia descriptions: ${analysis.descriptionStats.withWikipedia}`);
            console.log(`     - Basic descriptions: ${analysis.descriptionStats.withBasicDescription}`);
            console.log(`     - Average length: ${analysis.descriptionStats.averageLength} characters`);

            if (analysis.features.length > 0) {
                console.log(`   Features: ${analysis.features.join(', ')}`);
            }

            // Show sample descriptions
            if (result.data.cities && result.data.cities.length > 0) {
                console.log(`   Sample Descriptions:`);
                const sampleCities = result.data.cities.slice(0, 3);
                sampleCities.forEach((city, index) => {
                    const desc = city.description || 'No description';
                    const truncatedDesc = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
                    console.log(`     ${index + 1}. ${city.name}: ${truncatedDesc}`);
                });
            }
        }
        console.log('');
    }

    console.log('🎉 Wikipedia integration test completed!');
    console.log('\n💡 Notes:');
    console.log('   - Poland (PL) should include Wikipedia descriptions for cities');
    console.log('   - India should use local data with basic descriptions');
    console.log('   - Response times may be longer due to Wikipedia API calls');
    console.log('   - Descriptions are cleaned and limited to 200 characters');
    console.log('   - Failed Wikipedia requests fall back to default descriptions');
}

// Run tests
runTests();
