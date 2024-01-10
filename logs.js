const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const owner = 'niharkushwah';
const repo = 'nestjs-graphql';
const run_id = 0;
const token = ' '; // Replace with your actual token
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${run_id}/logs`;
// Make the GitHub API request using axios
axios({
  method: 'get', 
  url: apiUrl, 
  headers: { 
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }, 
  responseType: 'arraybuffer', // Specify the response type as arraybuffer
})
  .then(response => {
    // Create an instance of AdmZip with the binary data
    const zip = new AdmZip(response.data);
    // Create a directory to store log files
    const logsDirectory = 'logs';
    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory);
    } 
    // Get log entries from the ZIP file 
    const zipEntries = zip.getEntries();
    // Extract and print the content of each log file 
    zipEntries.forEach(entry => { 
      const filePath = path.join(logsDirectory, entry.entryName);
      // Create necessary subdirectories
      const dirname = path.dirname(filePath);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }
      fs.writeFileSync(filePath, entry.getData());
      console.log(`Log saved to: ${filePath}`);
    });
  })
  .catch(error => {
    console.error(`Error: ${error.message}`);
    console.log(error);
  });
