let betterData = JSON.parse(data.replaceAll('&#39;','"'))

let showAnswer = false
let termCounter = 0

function updateText(ms=0) {
    console.log(ms)
    $('#displayCard').delay(ms).queue(function(){
        $(this).text(betterData[termCounter][+showAnswer]).dequeue()
    })
}

$('#displayCard').hover(function(){
    if ($('#flipOnHoverCheckbox').is(':checked')) {
        showAnswer = true
        updateText(140)
    }
}, function(){
    if ($('#flipOnHoverCheckbox').is(':checked')) {
        showAnswer = false
        updateText(140)
    }
})



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