const {exec} = require('child_process')
require('dotenv').config()

const PORT = process.env.PORT || 3001;

exec(`netstat -ao | findstr :${PORT}`, (error, stdout, stderr) => {
    const args = stdout.split(/(\s+)/).filter(a => a.trim());
    const listeningIndex = args.indexOf('LISTENING')
    const procId = args[listeningIndex + 1]

    exec(`tskill ${procId}`, (err, stdout, stderr) => {
        console.log(procId, '-> OK')
    })
})
