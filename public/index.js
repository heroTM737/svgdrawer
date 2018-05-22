var radius = 5;
var lineFunction = d3.line()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y; })
    .curve(d3.curveNatural);

var svg = d3.select("#svgcontainer").append("svg");
var map = {};
var selectedId = null;

function drawCircle(group, data, drag) {
    group.selectAll("circle")
        .data(data).enter().append("circle")
        .attr("class", function (d) {
            return d.class;
        })
        .attr("id", function (d, i) {
            return i;
        })
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", radius)
        .call(drag);
}
var savedData = null;
$.get('data.json', function (result) {
    savedData = result;
    for (var i in result) {
        for (var j in result[i]) {
            createPath(j, i, result[i][j]);
        }
    }
});

function createPath(id, groupId, data) {
    var group = svg.append("g");
    var lineGraph = null;

    var drag = d3.drag();
    drag.on('drag', function (d, i) {
        d.x = d3.event.x;
        d.y = d3.event.y;
        d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
        lineGraph.attr('d', lineFunction(data));
    });

    drawCircle(group, data, drag);
    lineGraph = group.append("path")
        .attr("d", lineFunction(data))
        .on('click', function (a, b, c) {
            selectedId = id;
        });

    map[id] = {
        groupId,
        data,
        group,
        drag,
        lineGraph
    }
}

var saveData = function () {
    $.post('save', savedData, function (result) {
        alert(result);
    });
}

var addPoint = function () {
    var item = map[selectedId];
    item.data.push({
        x: Number(item.data[item.data.length - 1].x) + 15,
        y: Number(item.data[item.data.length - 1].y) + 15
    });
    drawCircle(item.group, item.data, item.drag);
    item.lineGraph.attr('d', lineFunction(item.data));
}
function genId() {
    return 'path-' + Math.floor(Math.random() * 10000) + '-' + (new Date().getTime());
}
var addPath = function () {
    var randomId = genId();
    while (savedData[randomId]) {
        randomId = genId();
    }
    var groupId = 'leaves';
    var newGroup = [
        {
            "x": "10",
            "y": "10"
        },
        {
            "x": "10",
            "y": "40"
        },
        {
            "x": "40",
            "y": "10"
        },
    ];
    savedData[groupId][randomId] = newGroup;
    createPath(randomId, 'leaves', newGroup);

}
