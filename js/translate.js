'use strict'

var gCache = loadFromStorage('tCache') || []
var gPrevTxt = ''

renderTranslateBtn()

function renderTranslateBtn() {
    const strHTML = `
        <input 
            type="button" 
            class="ticetsButton btn-translate-ticket" 
            value="תרגם לרוסית"
            name="cmbEnter" 
            tabindex="1">

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									
									

									
													
            `
    document.querySelectorAll('tbody:nth-child(3) td')[65].innerHTML += strHTML
    document.querySelector('.btn-translate-ticket').addEventListener('click', onTranslate)
}

async function onTranslate() {
    const elBtn = document.querySelector('.btn-translate-ticket')
    const elTextArea = document.querySelector('textarea')

    if (gPrevTxt) {
        elTextArea.value = gPrevTxt
        gPrevTxt = ''
        return
    }

    try {
        const fromCache = gCache.find(obj => obj.prev === elTextArea.value)

        if (!fromCache) {
            elBtn.style.pointerEvents = 'none'
            elBtn.style.opacity = '0.5'

            const translatedTxt = await translateTxt(elTextArea.value)
            gPrevTxt = elTextArea.value
            elTextArea.value = translatedTxt
            
            elBtn.style.pointerEvents = 'auto'
            elBtn.style.opacity = '1'

            saveCache(gPrevTxt, translatedTxt)
            showUserMsg(`טקסט תורגם בהצלחה (${gPrevTxt.length} תווים) `)
        } else {
            elTextArea.value = fromCache.translated
            gPrevTxt = fromCache.prev
        }

    } catch (err) {
        showErrorMsg('אופס, משהו השתבש')
    }
}

function saveCache(prev, translated) {
    gCache.push({ prev, translated })
    saveToStorage('tCache', gCache)
}