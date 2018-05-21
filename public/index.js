//The data for our line
var lineData = $.get('data.json', function (data) {
    let lineData = data.lineData;
    //This is the accessor function we talked about above
    var lineFunction = d3.line()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; })
        .curve(d3.curveNatural);

    var radius = 5;
    var svg = d3.select("body").append("svg");

    var drag = d3.drag();
    drag.on('drag', function (d, i) {
        d.x = d3.event.x;
        d.y = d3.event.y;
        d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
        lineGraph.attr('d', lineFunction(lineData));
    });

    function drawCircle() {
        svg.selectAll("circle")
            .data(lineData).enter().append("circle")
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


    var lineGraph = svg.append("path")
        .attr("d", lineFunction(lineData))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    drawCircle();

    window.saveData = function () {
        $.post('save', { lineData }, function (result) {
            alert(result);
        });
    }

    window.addPoint = function () {
        lineData.push({
            x: 10,
            y: 10
        });
        drawCircle();
        lineGraph.attr('d', lineFunction(lineData));
    }
});



