$(document).ready(populateIdeas());
$('#body').on('keyup', charCount)
$('#save').on('click', saveIdea).on('click', clearFields)
$('#search').on('keyup', searchIdeas);
$('.delete').on('click', deleteIdea)
$('.upvote').on('click', qualitySwapper)
$('.downvote').on('click', qualitySwapper)
$('p').on('keyup', blurTextBox);
$('p').on('blur', saveNewText);


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
    var newCard = buildCard(entry);
    $('.ideas').prepend(newCard);
}

function buildCard(entry) {
    var clone = cloneTemplate();
    clone.prop('id', entry.id)
    clone.find('h3').text(entry.name)
    clone.find('.idea-body').text(entry.body)
    clone.find('span').text(entry.quality);
    return clone
}

function cloneTemplate() {
    return $('#template').clone(true, true).removeClass('hidden');
}

function populateIdeas() {
    Object.keys(localStorage).forEach(function(key) {
        var entry = JSON.parse(localStorage.getItem(key))
        addIdea(entry);
    })
}

function saveIdea() {
    var id = nextId();
    var entry = new Idea(id, title.val(), body.val());
    localStorage.setItem(id, JSON.stringify(entry));
    addIdea(entry);
};

function charCount() {
    var count = $(this).val().length;
    $('#ch-count').text(count);
};

function deleteIdea() {
    var id = $(this).parent().parent().attr('id');
    $(this).parent().parent().addClass('hidden');
    localStorage.removeItem(id);
};


function saveNewText(e) {
    var newBody = $(this).text();
    var id = $(this).parent().attr('id');
    var idea = getFromStorage(id);
    idea.body = newBody;
    updateIdea(idea, id)
};

function blurTextBox(e) {
    var key = e.keyCode || e.charCode
    if (key == 13)
        $(this).blur();
}

function getFromStorage(id) {
    return JSON.parse(localStorage.getItem(id));
}

function searchIdeas() {
    var param = $(this).val().toUpperCase();
    var ideas = $('.idea');
    performSearch(param, ideas);
}

function performSearch(param, ideas) {
    for (var i = 0; i < ideas.length; i++) {
        var body = ideas[i].getElementsByTagName('p')[0].textContent;
        var title = ideas[i].getElementsByTagName('h3')[0].textContent;
        hideOrReveal(ideas, i, title, body, param)
    }
}

function hideOrReveal(ideas, i, title, body, param) {
    if (ideas[i].id === "template") {
        return;
    } else if (titleOrBodyIncludes(title, body, param)) {
        ideas[i].classList.remove('hidden')
    } else {
        ideas[i].classList.add('hidden')
    }
}

function titleOrBodyIncludes(title, body, param) {
    return title.toUpperCase().includes(param) || body.toUpperCase().includes(param)
}

function qualitySwapper(e) {
    var $quality = $(this).siblings('h4').find('span')
    var id = $(this).parent().parent().attr('id')
    var idea = getFromStorage(id)
    if (e.target.className === 'upvote') {
        idea.quality = qualities().up[$quality.text()]
    } else {
        idea.quality = qualities().down[$quality.text()]
    }

    updateIdea(idea, id);
    $quality.text(idea.quality)
}

function qualities() {
    const genius = 'genius';
    const plausible = 'plausible';
    const swill = 'swill';

    return {
        up: {
            genius,
            plausible: genius,
            swill: plausible,
        },
        down: {
            genius: plausible,
            plausible: swill,
            swill,
        },
    };
};

function updateIdea(idea, id) {
    localStorage.setItem(id, JSON.stringify(idea));
};