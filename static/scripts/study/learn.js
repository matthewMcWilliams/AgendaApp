let betterData = JSON.parse(data.replaceAll('&#39;','"'))
const BATCH_SIZE = 7



// https://stackoverflow.com/questions/17891173/how-to-efficiently-randomly-select-array-item-without-repeats
function randomNoRepeats(array) {
    var copy = array.slice(0);
    return function() {
      if (copy.length < 1) { copy = array.slice(0); }
      var index = Math.floor(Math.random() * copy.length);
      var item = copy[index];
      copy.splice(index, 1);
      return item;
    };
}

// https://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

class Batch {
    constructor(data) {
        this.words = this.sample(data)
        this.score = 0
    }

    get cardsRemaining() {
        return this.words.length > 0
    }

    nextCard() {
        this.currentCard = this.words.shift()
        $("#displayCardFront").text(this.currentCard[1])
        this.transitioning = false
        // todo: add multiple choice for new words
        if (this.currentCard[2] == 0) {

            $("#multi-response").removeClass("hidden")
            $("#multi-response").addClass("flex")
            
            $("#written-response").addClass("hidden")
            $("#written-response").removeClass("flex")

            let wordsCopy = [...betterData]
            shuffle(wordsCopy)
            let choices = wordsCopy.slice(0, 3)
            console.log(choices)
            if (choices.map(x => x[0].toLowerCase()).includes(this.currentCard[0].toLowerCase())) {
                choices = wordsCopy.slice(0,4)
            } else {
                choices.push(this.currentCard)
            }

            console.log(choices)
            $("#choiceA").text(choices[0][0])
            $("#choiceB").text(choices[1][0])
            $("#choiceC").text(choices[2][0])
            $("#choiceD").text(choices[3][0])

        } else if (this.currentCard[2] == 1) {

            $("#written-response").removeClass("hidden")
            $("#written-response").addClass("flex")
            
            $("#multi-response").addClass("hidden")
            $("#multi-response").removeClass("flex")
            

        } else {
            alert("ALREADY FINISHED THIS")
        }
    }

    checkAnswer(value) {
        // todo: mastery tracking functionality
        
        let correct = false
        if (value.toLowerCase() === this.currentCard[0].toLowerCase()) {
            correct = true
            $("#displayCardBack").addClass("correct")
            this.score ++
            this.currentCard[2]++
        } else {
            correct = false
            $("#displayCardBack").addClass("wrong")
            this.currentCard[2] = 0
        }
        
        $("#displayCardBack").text(this.currentCard[0])
        $("#flip-card").addClass("flipped")

        this.transitioning = true

        window.setTimeout(function() {
            $("#answerField").val('')
            $("#flip-card").removeClass("flipped")
            $("#displayCardBack").removeClass("correct")
            $("#displayCardBack").removeClass("wrong")
            if (currentBatch.cardsRemaining) {
                currentBatch.nextCard()
            } else {
                $("#learn-main").removeClass("flex")
                $("#learn-main").addClass("hidden")

                $("#correctCount").text(currentBatch.score)
                $("#batchCount").text(BATCH_SIZE)
                $("#questionCount").text(betterData.length)
                let masteryCount = betterData.filter(function(item) {
                    return item[2] >= 2
                }).length
                $("#masteredCount").text(masteryCount)
                $("#toGoCount").text(betterData.length - masteryCount)
                

                $("#round-finished").addClass("grid")
                $("#round-finished").removeClass("hidden")
            }
        }, 3000)
    }

    sample(data) {
        let generator = randomNoRepeats(
            data.filter(c => c[2] < 2)
        )
        let output = []
        for (let i = 0; i < Math.min(data.length, BATCH_SIZE); i++) {
            output.push(generator())
        }
        return output
    }
}


let currentBatch = null


$("#answerField").on("keyup", function(e){
    if ((e.key === "Enter" || e.keyCode === 13) && !currentBatch.transitioning) {
        currentBatch.checkAnswer($("#answerField").val())
    }
})

$("#checkButton").click(function(){
    if (!currentBatch.transitioning) {
        currentBatch.checkAnswer($("#answerField").val())
    }
})

$("#choiceA").click(function(){
    if (!currentBatch.transitioning) {
        currentBatch.checkAnswer($("#choiceA").text())
    }
})
$("#choiceB").click(function(){
    if (!currentBatch.transitioning) {
        currentBatch.checkAnswer($("#choiceB").text())
    }
})
$("#choiceC").click(function(){
    if (!currentBatch.transitioning) {
        currentBatch.checkAnswer($("#choiceC").text())
    }
})
$("#choiceD").click(function(){
    if (!currentBatch.transitioning) {
        currentBatch.checkAnswer($("#choiceD").text())
    }
})


function startRound() {
    $("#learn-main").removeClass("hidden")
    $("#learn-main").addClass("flex")
    $("#landing").addClass("hidden")
    $("#landing").removeClass("flex")
    $("#round-finished").addClass("hidden")
    $("#round-finished").removeClass("flex")
    $("#answerField").focus()
    currentBatch = new Batch(betterData)
    currentBatch.nextCard()
}

$("#startButton").click(startRound)
$("#continueButton").click(startRound)

