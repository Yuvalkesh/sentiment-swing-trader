#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 Setting up Sentiment Swing Trader...\n');

async function runCommand(command, cwd = process.cwd()) {
    try {
        console.log(`📦 Running: ${command}`);
        execSync(command, { stdio: 'inherit', cwd });
        console.log('✅ Success!\n');
    } catch (error) {
        console.error(`❌ Error running command: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

async function checkFile(filePath) {
    try {
        await fs.promises.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function setup() {
    console.log('1. Installing root dependencies...');
    await runCommand('npm install');

    console.log('2. Installing backend dependencies...');
    await runCommand('npm install', path.join(process.cwd(), 'backend'));

    console.log('3. Installing frontend dependencies...');
    await runCommand('npm install', path.join(process.cwd(), 'frontend'));

    console.log('4. Checking environment configuration...');
    const envExists = await checkFile('.env');
    if (!envExists) {
        console.log('📝 Creating .env file from template...');
        const envExample = await fs.promises.readFile('.env.example', 'utf-8');
        await fs.promises.writeFile('.env', envExample);
        console.log('✅ .env file created');
        console.log('⚠️  Please edit .env with your API keys before running the app');
    } else {
        console.log('✅ .env file already exists');
    }

    console.log('\n🎉 Setup complete!\n');
    console.log('📋 Next steps:');
    console.log('1. Edit .env with your API keys:');
    console.log('   - OPENAI_API_KEY (required for sentiment analysis)');
    console.log('   - ALPACA_API_KEY & ALPACA_SECRET_KEY (for paper trading)');
    console.log('   - NEWS_API_KEY (for news sentiment)');
    console.log('   - TWITTER_BEARER_TOKEN (optional for Twitter sentiment)');
    console.log('\n2. Start the application:');
    console.log('   npm run dev');
    console.log('\n3. Open your browser:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend API: http://localhost:3001');
    console.log('\n📚 For more help, see README.md');
}

setup().catch(console.error);