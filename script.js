$('img.upvote').on('mouseenter', function() {
    $(this).prop('src', 'images/upvote-hover.svg')
})
$('img.upvote').on('mouseleave', function() {
    $(this).prop('src', 'images/upvote.svg')
})

$('img.downvote').on('mouseenter', function() {
    $(this).prop('src', 'images/downvote-hover.svg')
})
$('img.downvote').on('mouseleave', function() {
    $(this).prop('src', 'images/downvote.svg')
})

$('img.delete').on('mouseenter', function() {
    $(this).prop('src', 'images/delete-hover.svg')
})
$('img.delete').on('mouseleave', function() {
    $(this).prop('src', 'images/delete.svg')
})

var title = $('#title')
var body = $('#body')

function Idea(id, name, body, quality = 'swill') {
    this.id = id;
    this.name = name;
    this.body = body;
    this.quality = quality;
}

function nextId() {
    if (Object.keys(localStorage).length === 0) {
        return 1;
    } else {
        var existingKeys = Object.keys(localStorage).map(function(num) { return parseInt(num) });
        return (existingKeys.pop() + 1);
    }
}

function clearFields() {
    title.val('');
    body.val('')
    $('#ch-count').text(0);
}

function addIdea(entry) {
    var $clone = $('#template').clone(true, true);
    $clone.removeClass('hidden')
    $clone.prop('id', entry.id)
    $clone.find('h3').text(entry.name);
    $clone.find('.idea-body').text(entry.body);
    $clone.find('span').text(entry.quality);
    $('.ideas').prepend($clone);
}

$(document).ready(function() {
    Object.keys(localStorage).forEach(function(key) {
        var entry = JSON.parse(localStorage.getItem(key))
        addIdea(entry);
    })
})

$('#body').on('keyup', function() {
    var count = $(this).val().length
    $('#ch-count').text(count);
})

$('#save').on('click', function() {
    var id = nextId();
    var entry = new Idea(id, title.val(), body.val());
    localStorage.setItem(id, JSON.stringify(entry));
    clearFields();
    addIdea(entry);
})

$('.delete').on('click', function() {
    var id = $(this).parent().parent().attr('id')
    $(this).parent().parent().addClass('hidden')
    localStorage.removeItem(id)
})

$('.upvote').on('click', function() {
    var $quality = $(this).siblings('h4').find('span');
    var id = $(this).parent().parent().attr('id')
    var idea = JSON.parse(localStorage.getItem(id))
    switch ($quality.text()) {
        case "swill":
            idea.quality = 'plausible'
            localStorage.setItem(id, JSON.stringify(idea));
            $quality.text('plausible')
            break;
        case "plausible":
            idea.quality = 'genius'
            localStorage.setItem(id, JSON.stringify(idea));
            $quality.text('genius')
            break;
        case 'genius':
            break;
    }
})

$('.downvote').on('click', function() {
    var $quality = $(this).siblings('h4').find('span')
    var id = $(this).parent().parent().attr('id')
    var idea = JSON.parse(localStorage.getItem(id))
    switch ($quality.text()) {
        case "genius":
            idea.quality = 'plausible'
            localStorage.setItem(id, JSON.stringify(idea));
            $quality.text('plausible')
            break;
        case "plausible":
            idea.quality = 'swill'
            localStorage.setItem(id, JSON.stringify(idea));
            $quality.text('swill')
            break;
        case 'swill':
            break;
    }
})

$('p').on('click', function() {
    $(this).prop('contentEditable', true);
})

$('p').on('keypress', function(e) {
    if (e.keyCode == 13) {
        $(this).prop('contentEditable', false)
    }
});

$('p').on('blur', function() {
    $(this).prop('contentEditable', false)
    var newBody = $(this).text()
    var id = $(this).parent().attr('id')
    var idea = JSON.parse(localStorage.getItem(id))
    idea.body = newBody;
    localStorage.setItem(id, JSON.stringify(idea));
});

$('#search').on('keyup', function() {
    var param = $(this).val().toUpperCase();
    var ideas = $('.idea');
    for (var i = 0; i < ideas.length; i++) {
        if (ideas[i].id === "template") {
            return;
        } else if (ideas[i].children[0].children[0].innerHTML.toUpperCase().includes(param) || ideas[i].children[1].innerHTML.toUpperCase().includes(param)) {
            ideas[i].classList.remove('hidden')
        } else {
            ideas[i].classList.add('hidden')
        }
    }
})