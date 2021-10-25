function generateMessage(username, text) {
    return {
        username: username,
        text: text,
        timestamp: new Date().getTime()
    }
}

module.exports = generateMessage