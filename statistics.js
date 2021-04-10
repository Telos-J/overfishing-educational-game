const populationChart = new Chart(document.querySelector('#chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'shark',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: '#FF2836',
        },
        {
            label: 'fish',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: '#36CFB6',
        }]
    },
    options : {
        responsive: true,
        elements: {
            line: {
                tension: 0.4
            },
            point: {
                radius: 0
            }
        },
        layout: {
            padding: {
                left: 10,
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false,
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                }   
            }]
        },
        events: []
    }
})

let isTabActive = true;

window.onfocus = function () { 
  isTabActive = true; 
}; 

window.onblur = function () { 
  isTabActive = false; 
}; 

window.setInterval(() => {
  if (isTabActive) {
    populationChart.data.labels.push('')
    populationChart.data.datasets[0].data.push(sharks.length)
    populationChart.data.datasets[1].data.push(fishes.length)
    populationChart.update()
  }
},1000)
