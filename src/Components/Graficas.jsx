import { useEffect, useState, useRef } from 'react';
import { Chart, Tooltip, ArcElement, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
Chart.register(ArcElement, Tooltip, Legend);
function Graficas(props) {
  //console.log(props.bgColors);
  const [labelActive, setLabelActive] = useState(false);
  const chartRef = useRef(null);
  
  function handleClickDiv() {
    if (!labelActive) {
      if(props.handle!=undefined)props.handle(props.variable);
    }
  };

  function handleClickLabel(e, legendItem, legend) {
    if(props.manage!=undefined){
      props.manage(props.variable);
    }
    legend.chart.toggleDataVisibility(legendItem.index);
    legend.chart.update();
  }

  useEffect(() => {
    const chartInstance = chartRef.current;
    function handleMouseMove(e) {
      const legend = chartInstance.legend;
      if (legend && legend.legendHitBoxes && legend.legendHitBoxes.length > 0) {
        const offsetX = chartInstance.canvas.offsetLeft;
        const offsetY = chartInstance.canvas.offsetTop;

        const mouseX = e.pageX - offsetX;
        const mouseY = e.pageY - offsetY;

        for (let i = 0; i < legend.legendHitBoxes.length; i++) {
          const hitBox = legend.legendHitBoxes[i];

          if (
            mouseX >= hitBox.left &&
            mouseX <= hitBox.left + hitBox.width &&
            mouseY >= hitBox.top &&
            mouseY <= hitBox.top + hitBox.height
          ) {
            setLabelActive(true);
            return;
          }
        }
      }
      setLabelActive(false);
    }

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const data = {
    labels: props.labels,
    datasets: [
      {
        label: props.label,
        data: props.data,
        backgroundColor: [`rgba(${props.bgColors[0]}, 1)`,props.bgColors[1]],
        borderColor: [`rgba(${props.bgColors[0]}, 0)`,'white'],
        borderWidth: 1,
        datalabels: {
          align: 'left',
          anchor: 'left'
        }
      },
    ],
  };
  function innerText(chart){
    var width = chart.width, height = chart.height, ctx = chart.ctx;
    ctx.restore();
    var fontSize = ((height / 160)+.5).toFixed(2);
    ctx.font = fontSize + "em calibri";
    ctx.textBaseline = "top";
    const divisor = chart.data.datasets[0].data[0]+chart.data.datasets[0].data[1]
    var text = `${divisor!=0?(
      (chart.data.datasets[0].data[0]*100)
      /
      (divisor)
    ).toFixed(2):0}%`,
    textX = Math.round((width - ctx.measureText(text).width) / 2),
    textY = (height/2)-27.5;
    //console.log(textY);
    ctx.fillText(text, textX, textY);
    ctx.save();
  }
  const plugins = [{
    beforeDraw: function(chart) {
      innerText(chart);
    }
  }]

  const options = {
    responsive: true,
    cutout: 40,
    plugins: {
      legend: {
          position: 'bottom',
          display: true,
          onClick:handleClickLabel
      },
    },
  }

  return (
    <div className={`h-36 w-36 cursor-pointer m-2`}
    onClick={(e)=>handleClickDiv()}>
      <Doughnut ref={chartRef} data={data} options={options}plugins={plugins}/>
    </div>
  )
}

export default Graficas