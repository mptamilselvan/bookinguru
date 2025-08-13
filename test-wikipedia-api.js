const axios = require('axios');

async function testWikipediaAPI() {
    console.log('📚 Testing Wikipedia API Integration...\n');

    const testCities = ['Chennai', 'Warsaw', 'Mumbai', 'London'];

    for (const city of testCities) {
        try {
            console.log(`🔍 Testing city: ${city}`);

            const response = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                    action: 'query',
                    list: 'search',
                    srsearch: city,
                    format: 'json',
                    origin: '*'
                },
                timeout: 5000
            });

            if (response.data &&
                response.data.query &&
                response.data.query.search &&
                response.data.query.search.length > 0) {

                const snippet = response.data.query.search[0].snippet;

                // Clean the snippet (simplified version)
                let cleanSnippet = snippet
                    .replace(/<[^>]*>/g, '')           // Remove HTML tags
                    .replace(/&amp;/g, '&')            // Decode &amp;
                    .replace(/&lt;/g, '<')             // Decode &lt;
                    .replace(/&gt;/g, '>')             // Decode &gt;
                    .replace(/&quot;/g, '"')           // Decode &quot;
                    .replace(/&#39;/g, "'")            // Decode &#39;
                    .replace(/&nbsp;/g, ' ')           // Decode &nbsp;
                    .replace(/\s+/g, ' ')              // Normalize whitespace
                    .trim();                           // Trim edges

                // Limit length
                if (cleanSnippet.length > 200) {
                    cleanSnippet = cleanSnippet.substring(0, 200) + '...';
                }

                console.log(`   ✅ Success: ${cleanSnippet}`);
                console.log(`   📏 Length: ${cleanSnippet.length} characters`);
            } else {
                console.log(`   ❌ No results found for ${city}`);
            }

        } catch (error) {
            console.log(`   ❌ Error for ${city}: ${error.message}`);
        }

        console.log('');
    }

    console.log('🎉 Wikipedia API test completed!');
    console.log('\n💡 Notes:');
    console.log('   - All cities should return Wikipedia snippets');
    console.log('   - Snippets are cleaned and limited to 200 characters');
    console.log('   - HTML tags and entities are properly decoded');
    console.log('   - This test verifies the Wikipedia API integration works');
}

// Run test
testWikipediaAPI();
