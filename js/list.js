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
            update(d['Hive ID'])
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
        listContainsPlant(["S011821", "S011893"])
    });

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