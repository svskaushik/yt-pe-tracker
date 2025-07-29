// Quick test to verify GitHub data fetch
const url =
  'https://raw.githubusercontent.com/svskaushik/yt-pe-tracker/4421677/data/channels.min.json';

async function testFetch() {
  try {
    console.log('Testing GitHub data fetch...');
    const response = await fetch(url);
    const data = await response.json();

    console.log(`✅ Successfully fetched data`);
    console.log(`📊 Total channels: ${data.meta.total_channels}`);
    console.log(`📅 Generated at: ${data.meta.generated_at}`);
    console.log(`🔍 First few channels:`);

    data.channels.slice(0, 5).forEach((channel, index) => {
      console.log(
        `  ${index + 1}. ${channel.channel_name} (@${channel.channel_handle}) - ${channel.pe_firm}`
      );
    });

    console.log(
      `\n🎯 Extension will now be able to show badges for all ${data.meta.total_channels} channels!`
    );
  } catch (error) {
    console.error('❌ Fetch failed:', error);
  }
}

testFetch();
