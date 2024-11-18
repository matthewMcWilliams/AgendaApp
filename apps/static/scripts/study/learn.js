data = data.replaceAll('&#34;','"')
let betterData = JSON.parse(data)
const BATCH_SIZE = 4


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

    masteryCount(x) {
        return betterData.filter(item => {
            return item["mastery"] == x
        }).length
    }

    

    nextCard() {
        this.currentCard = this.words.shift()
        $("#displayCardFront").text(this.currentCard["definition"])
        this.transitioning = false
        // todo: add multiple choice for new words
        if (this.currentCard["mastery"] == 0) {

            $("#multi-response").removeClass("hidden")
            $("#multi-response").addClass("flex")
            
            $("#written-response").addClass("hidden")
            $("#written-response").removeClass("flex")

            let wordsCopy = [...betterData]
            shuffle(wordsCopy)
            let choices = wordsCopy.slice(0, 3)
            if (choices.map(x => x["term"].toLowerCase()).includes(this.currentCard["term"].toLowerCase())) {
                choices = wordsCopy.slice(0,4)
            } else {
                choices.push(this.currentCard)
            }
            shuffle(choices)

            $("#choiceA").text(choices[0]["term"])
            $("#choiceB").text(choices[1]["term"])
            $("#choiceC").text(choices[2]["term"])
            $("#choiceD").text(choices[3]["term"])

        } else if (this.currentCard["mastery"] == 1) {

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
        if (value.toLowerCase() === this.currentCard["term"].toLowerCase()) {
            correct = true
            $("#displayCardBack").addClass("correct")
            this.score ++
            this.currentCard["mastery"]++
        } else {
            correct = false
            $("#displayCardBack").addClass("wrong")
            this.currentCard["mastery"] = 0
        }
        
        $("#displayCardBack").text(this.currentCard['definition'] + '  ➡  ' + this.currentCard["term"])
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
                currentBatch.finishRound()
            }
        }, 2500)
    }

    finishRound() {
        $("#learn-main").removeClass("flex")
        $("#learn-main").addClass("hidden")

        $("#correctCount").text(this.score)
        $("#batchCount").text(BATCH_SIZE)

        $("#unknownCount").text(this.masteryCount(0))
        $("#learnedCount").text(this.masteryCount(1))
        $("#masteryCount").text(this.masteryCount(2))
        
        this.saveData()

        if (this.masteryCount(2) >= betterData.length) {
            endLearn()
        } else {
            $("#round-finished").addClass("grid")
            $("#round-finished").removeClass("hidden")
        }
    }

    saveData() {
        let formData = new FormData()

        formData.append('length', betterData.length)

        for (let i = 0; i < betterData.length; i++) {
            const card = betterData[i];

            formData.append(`${i}-id`, card.id)
            formData.append(`${i}-term`, card.term)
            formData.append(`${i}-definition`, card.definition)
            formData.append(`${i}-mastery`, card.mastery)

        }

        fetch(`/study/decks/${deckID}/learn/save`, {
            method: "post",
            body: formData
        });
    }

    

    sample(data) {
        let generator = randomNoRepeats(
            data.filter(c => c["mastery"] < 2)
        )
        let output = []
        for (let i = 0; i < Math.min(data.length - this.masteryCount(2), BATCH_SIZE); i++) {
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
    currentBatch = new Batch(betterData)
    if (currentBatch.masteryCount(2) >= betterData.length) {
        endLearn()
        return
    }
    $("#learn-main").removeClass("hidden")
    $("#learn-main").addClass("flex")
    $("#landing").addClass("hidden")
    $("#landing").removeClass("flex")
    $("#round-finished").addClass("hidden")
    $("#round-finished").removeClass("flex")
    $("#answerField").focus()
    currentBatch.nextCard()
}

function endLearn() {
    $("#learn-main").removeClass("flex")
    $("#learn-main").addClass("hidden")

    $("#learn-finished").addClass("flex")
    $("#learn-finished").removeClass("hidden")

    $("#landing").removeClass("grid")
    $("#landing").addClass("hidden")
}

$("#startButton").click(startRound)
$("#continueButton").click(startRound)

