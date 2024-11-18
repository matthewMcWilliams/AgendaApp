var $ = function( id ) { return document.getElementById( id ); };
const socket = io()


let deckId = -1


socket.on('joined_room', ({deckId, gameCode}) => {

    const baseUrl = '/study/decks/' + deckId + '/play/tower-defense'
    const params = new URLSearchParams({
        code: gameCode,
        nickname: $('nickname').value
    })

    window.location.assign(`${baseUrl}?${params.toString()}`)
});



$('joinForm').addEventListener('submit', (event) => {
    event.preventDefault()

    socket.emit('join_lobby', {
        'code':$('codeInput').value,
        'nickname':$('nickname').value
    })

})
