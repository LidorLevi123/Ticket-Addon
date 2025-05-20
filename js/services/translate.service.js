'use strict'

const part1 = 'AIzaSyAXsc2TeI'
const part2 = 'EQsiqEMciFdeszFYOlMcYuGs'
const KEY = part1 + '-' + part2

async function translateTxt(txt) {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: txt,
            source: 'he',
            target: 'ru',
            format: 'text'
        })
    })

    const data = await response.json()
    return data.data.translations[0].translatedText
}