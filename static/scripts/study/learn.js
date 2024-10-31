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
            // multiple choice
        } else if (this.currentCard == 1) {
            // written
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
        for (let i = 0; i < BATCH_SIZE; i++) {
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


