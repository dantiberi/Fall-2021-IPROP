import React, { useEffect, useState } from "react";
import functionPlot from "function-plot";

interface FunctionProperties{
    function: string
    solution: string
}

const FunctionPlot: React.FC<FunctionProperties> = (props) => {

    const [y, setY] = useState(1);
    let contentsBounds = document.body.getBoundingClientRect();
    

    let width = contentsBounds.width * 0.3
    let height = width

    
    if (props.solution !== ""){
      const y1 = functionPlot.$eval.builtIn({fn: props.function}, 'fn', {x: +props.solution})
      if (y1 === 0){
        alert('correct solution')
      }
    }

    function useSolutionChecker(y: number) {

      useEffect(() => {

          function handleClick(event: { target: any; }) {
            if (-0.1 < y && y < 0.1){
              alert('correct '+ y)
            }
          }
          
          const id = document.getElementById('functionPlot')
          if (id){
            id.addEventListener("click", handleClick);
            return () => {
                id.removeEventListener("click", handleClick);
            };
          }
          // Bind the event listener
      });
    }    
    
    useEffect(() => {
      functionPlot({
        target: "#functionPlot",
        width ,
        height,
        yAxis: { domain: [-10, 10] },
        xAxis: { domain: [-10, 10] },
        grid: true,
        tip: {
            xLine: true,    // dashed line parallel to y = 0
            yLine: true,    // dashed line parallel to x = 0
            renderer: function (x, y, index) {
                if (props.solution === ""){
                  const y1 = functionPlot.$eval.builtIn({fn: props.function}, 'fn', {x: x})
                  setY(y1)
                }
              return ''
            }
          },
        data: [
        {
            fn: props.function

        }]
        
      })
    }, [width, height, props]);
    useSolutionChecker(y)

    
    return(
        <div id='functionPlot' style={{display: "inline-block"}}>
        </div>
    );
};

export default FunctionPlot;
