import fs from 'node:fs'

export default {
    watch: ['./reading.json'],

    load(watchedFiles) {
        return JSON.parse(fs.readFileSync(watchedFiles[0], 'utf-8'))
    }
}
