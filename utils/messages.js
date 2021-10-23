function generateMessage(text){
    return {
        text: text,
        timestamp: new Date().getTime()
    }
}

module.exports = generateMessage