$('#sort-name').click(function() {
    $('#sort-discriminator').val('name')
    $('#sort-form').submit()
})

$('#sort-status').click(function() {
    $('#sort-discriminator').val('status')
    $('#sort-form').submit()
})