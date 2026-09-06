const fs = require('fs');

function resolveConflict(filepath, keepOurs = false) {
    let content = fs.readFileSync(filepath, 'utf8');
    const regex = /<<<<<<< Updated upstream[\s\S]*?=======\n([\s\S]*?)>>>>>>> Stashed changes\n/g;

    // Actually we want the Stashed changes since that's from our previous branch state
    // where we updated package versions and test setup files
    const newContent = content.replace(regex, keepOurs ? '' : '$1');
    fs.writeFileSync(filepath, newContent, 'utf8');
}

resolveConflict('package.json', false);
resolveConflict('vite.config.ts', false);
resolveConflict('src/setupTests.ts', false);
