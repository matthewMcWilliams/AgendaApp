let betterData = JSON.parse(data.replaceAll('&#39;','"'))

let showAnswer = false
let termCounter = 0

function updateText() {
    $('#displayCard').text(betterData[termCounter][+showAnswer])
}

$('#displayCard').click(function(){
    showAnswer = !showAnswer
    updateText()
})

$('#backArrow').click(function(){
    if (termCounter > 0) {
        termCounter--
        showAnswer = false
    }
    updateText()
})

$('#nextArrow').click(function(){
    if (termCounter < betterData.length) {
        termCounter++
        showAnswer = false
    }
    updateText()
})

updateText()