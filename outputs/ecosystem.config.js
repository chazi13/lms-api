module.exports = {
    apps: [{
        name: 'mejik2',
        script: 'npm',
        args: 'run production',
        log_file: './pm2.log'
    }]
}