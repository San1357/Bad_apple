// async/await is too complicated for monke brain, so this script uses some 
// perfectly timed setIntervals and setTimeouts.
// This code works today april 26, 2021. There are big chances it will not work in the future.
var svgns = "http://www.w3.org/2000/svg";
var svg = document.getElementsByClassName('js-calendar-graph-svg')[0]
var g = svg.children[0];
var colN = 53;
var rowN = 39;

start()

function start() {
    fillLastCol()
    startAppendingRows()
    setTimeout(function() {
        let socket = new WebSocket("ws://localhost:8182");
        socket.onmessage = function(event) {
            draw(event.data);
        };
        socket.onerror = function(error) {
            alert(`[error] ${error.message}`);
        };
    }, 5000)
}

function setLevel(x, y, level) {
    if (y >= rowN || x >= colN) {
        return
    }
    g.children[x].children[y].dataset.level = level;
}

function getLevel(x, y) {
    if (y >= rowN || x >= colN) {
        return false
    }
    return g.children[x].children[y].dataset.level;
}


function genRect(x, y) {
    var rect = document.createElementNS(svgns, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('height', '10');
    rect.setAttribute('width', '10');
    rect.setAttribute('class', 'ContributionCalendar-day');
    rect.setAttribute('data-level', 0);
    return rect;
}

function getColX(i) {
    return parseInt(g.children[i].children[0].getAttribute('x'));
}

function getColMaxY(i) {
    var lastC = g.children[i].children.length;
    return parseInt(g.children[i].children[lastC - 1].getAttribute('y'));
}
// depending on the day of the week, last column in contributions graph might not
// be a full 7 days.
function fillLastCol() {
    // last column index
    var i = colN - 1;
    var col = g.children[i];
    var colX = getColX(i);
    var y = getColMaxY(i);

    for (var cLen = col.children.length; cLen < 7; cLen++) {
        y += 13;
        rect = genRect(colX, y);
        col.appendChild(rect);
    }
}

var appendedRs = 0

function appendRow() {
    appendedRs++
    var currH = parseInt(svg.getAttribute('height'));
    svg.setAttribute('height', currH + 14);
    for (var i = 0; i < colN; i++) {
        var col = g.children[i];
        var colX = getColX(i);
        var y = getColMaxY(i);
        rect = genRect(colX, y + 13);
        col.appendChild(rect);
    }
    if (appendedRs == rowN - 7) {
        clearInterval(ari)
        lri = setInterval(lowerRows, 50)
    }
}

var offset = 0
// append rows interval && lower rows interval
var ari, lri

function lowerRows() {
    offset++
    for (var i = offset + 6; i > 0; i--) {
        for (var j = 0; j < colN; j++) {
            var currL = getLevel(j, i - 1);
            if (currL === false) {
                continue;
            }
            setLevel(j, i - 1, 0);
            setLevel(j, i, currL);
        }
        if (offset > rowN) {
            clearInterval(lri);
        }
    }
}

function startAppendingRows() {
    ari = setInterval(appendRow, 50)
}

function draw(txt) {
    for (var i = 0; i < colN * rowN; i++) {
        var x = i % colN;
        var y = parseInt(i / colN);
        setLevel(x, y, txt[i]);
    }
}
