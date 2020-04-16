// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {


    function chart(data) {

        var columns = Object.keys(data[0])

        var table = d3.select('#vertical-menu').append('table')
        var thead = table.append('thead')
        var tbody = table.append('tbody')

        thead.append('tr')
            .selectAll('th')
            .data(columns)
            .enter()
            .append('th')
            .text(function (d) { return d })

        var rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr')

        var cells = rows.selectAll('td')
            .data(function(row) {
                return columns.map(function (column) {
                    return { column: column, value: row[column] }
                })
            })
            .enter()
        .append('td')
            .text(function (d) { return d.value })

        rows.on("mousedown", (d, i, elements) => {
            d3.select("tr.selected").classed("selected", false)
            d3.select(elements[i]).classed("selected", true)
            update(d['Hive ID'], d['Health'], d['City'])
            highlightMap(d['Hive ID'])
        }).on("mouseover", (d, i, elements) => {
            d3.select(elements[i]).classed("mouseover", true)
        }).on("mouseout", (d, i, elements) => {
            d3.select(elements[i]).classed("mouseover", false)
        });

        return table;
    }


    d3.csv("data/ids_cities_health.csv", function(data) {
        console.log(data)
        chart(data)
    });

    function highlightMap(hive) {
        var circles = d3.selectAll("circle.cities")
        clearMarks(d3.selectAll("circle.selected"))
        circles.each((d, i, elements) => {
            if(d['Hive ID'] === hive) {
                markPoint(elements[i])
            }
        })
    }

    function markPoint (element) {
        var currentElement = d3.select(element).raise();
        currentElement
          .classed('selected', true)
          .transition()
          .duration(100)
          .attr('r', 20)
          .attr('fill', 'orange');
      }

      function clearMarks(elements) {
          elements.each((d, i, elements) => {
            d3.select(elements[i])
            .classed('selected', false)
            .transition()
            .duration(100)
            .attr('r', 4)
          })
      }

    function listContainsPlant(hiveList) {
        var row = d3.selectAll('tr')
        .each((d, i, elements) => {
            if(d == null || hiveList == null) {
                return
            } else if (hiveList.includes(d['Hive ID'])){
                d3.select(elements[i]).classed("containsPlant", true);
            }
        });
    }

})());