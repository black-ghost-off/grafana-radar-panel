import React from 'react';
import { PanelProps } from '@grafana/data';
import { Options } from 'types';
import { css, cx } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
import { getStyles } from './components/getStyles';
import { maping_value, describeArc, degrees_to_radians } from './components/drawSVGArc';

import Gradient from "javascript-color-gradient";

function findField(frame: any, name: string) {
  for(let seria of frame.series){
    for(let field of seria.fields){
      if(field.name === name){return field}
    }
  }
  return 0;
 }

interface Props extends PanelProps<Options> {}

export function Panel({
  options,
  data,
  width,
  height,
}: Props) {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  let r = (height>width?width/2:height/2)/100*90;
  const options_as = [];
  let start, end;
  let scale_range;

  let out_of_range = false;
  let start_higher_than_end = false;
  let fieldserrot = false;

  if(!options.is360degrees){
    start = options.StartDegree;
    end = options.EndDegree;
    scale_range = options.ScaleRange;
    if(Math.abs(start * scale_range - end * scale_range) > 360){
      start = -1;
      end = 1;
      out_of_range = true;
    }
    if(start * scale_range > end * scale_range){
      start = end-1;
      start_higher_than_end  = true;
    }
  }
  else{
    start = 0;
    end = 360;
    scale_range = 1;
  }

  let degree_steps = options.StepsDegrees - (options.is360degrees?0:1);
  let degree_step = Math.abs(start - end) / degree_steps;
  let distance_line_steps = options.StepsDistance;
  let rotate_radar = options.RotateRadar;
  let x_offset = options.XMove;
  let y_offset = options.YMove;
  let scale_size = options.ScaleSize;
  let zero_offset = 0;
  let distance_line_step = (100 - zero_offset) / distance_line_steps;


  if(!options.is360degrees){
    for (let distance_line = zero_offset; distance_line <= 100 ; distance_line += distance_line_step){
      options_as.push(<path d={describeArc(0, 0, maping_value(distance_line, 0, 100, 0, r*scale_size), 180+(start*scale_range) + rotate_radar, 180+(end*scale_range) + rotate_radar)} stroke={theme.colors.primary.shade} fillOpacity={0}></path>);
    }
  }
  else{
    for (let distance_line = zero_offset; distance_line <= 100; distance_line += distance_line_step){
      options_as.push(<circle r={maping_value(distance_line, 0, 100, 0, r*scale_size)} stroke={theme.colors.primary.shade} fillOpacity={0}></circle>);
    }
  }

  for (let deg = start; deg <= end; deg+=degree_step) {
    let deg_proc = -((deg * scale_range) + rotate_radar);
    if(!(scale_range === 1 && deg === 360)){
      options_as.push(<line x1={(r / 100 * zero_offset)*Math.sin(degrees_to_radians(deg_proc)) * scale_size} y1={(r / 100 * zero_offset)*Math.cos(degrees_to_radians(deg_proc)) * scale_size} x2={r*Math.sin(degrees_to_radians(deg_proc)) * scale_size} y2={r*Math.cos(degrees_to_radians(deg_proc)) * scale_size} stroke={theme.colors.primary.shade} />);
      options_as.push(<text x={r*Math.sin(degrees_to_radians(deg_proc)) * scale_size} y={r*Math.cos(degrees_to_radians(deg_proc)) * scale_size} className={styles.radar_degs_nums}>{deg}</text>);        
    }
  }  
  let data_len;

  if(findField(data, options.DistanceField) === 0 || findField(data, options.DegreesField) === 0){
    fieldserrot = true;
  }
  else
  {
    data_len = findField(data, options.DistanceField).values.length;
    for (let inc_field = 0; inc_field < data_len; inc_field++){
      let dist = findField(data, options.DistanceField).values[inc_field];
      if(dist < 0) {dist = 0;}
      if(dist > 100) {dist = 100;}
      dist = maping_value(dist,0,100,zero_offset*scale_size,r*scale_size);

      let power = findField(data, options.PowerField).values[inc_field];
      
      let min_time = findField(data, options.PowerField).values[0];
      let max_time = findField(data, options.PowerField).values[findField(data, options.PowerField).values.length-1];

      let rot  = maping_value(findField(data, options.DegreesField).values[inc_field],0,360,-start * scale_range,-end * scale_range) - rotate_radar;
      let x_c  = dist * Math.sin(degrees_to_radians(rot));
      let y_c  = dist * Math.cos(degrees_to_radians(rot));
      if(options.GradientSource === "Color"){
        options_as.push(<circle cx={x_c} cy={y_c} r={options.DotsSize} fill={options.DotsColor} />);
      }
      if(options.GradientSource === "Gradient"){
        if(findField(data, options.DegreesField) === 0){
          fieldserrot = true;
        }
        else{
          if(options.PowerField === "time"){
            const gradientArray = new Gradient()
            .setColorGradient.apply(null, options.Gradient.split(" "))
            .setMidpoint(100)
            .getColor(maping_value(power, min_time, max_time, 1, 100));
            options_as.push(<circle cx={x_c} cy={y_c} r={options.DotsSize} fill={gradientArray} />);
          }
          else{
            if(power === 0){ power++;}
            const gradientArray = new Gradient()
              .setColorGradient.apply(null, options.Gradient.split(" "))
              .setMidpoint(100)
              .getColor(power);
            options_as.push(<circle cx={x_c} cy={y_c} r={options.DotsSize} fill={gradientArray} />);
          }
        }
      }
    }
  }


  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {!(out_of_range || start_higher_than_end || fieldserrot) && <svg
        className={styles.svg}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`-${(width / 2) + (width / 2 / 100 * x_offset)} -${(height / 2) + (height / 2 / 100 * y_offset)} ${width} ${height}`}
      >
        <g>
        {options_as}
        </g>
      </svg> }
      

      <div className={styles.textBox}>
        {(out_of_range) && <div>Out of range</div>}
        {(start_higher_than_end) && <div>the initial value cannot be higher than the final value</div>}
        {(fieldserrot) && <div>Error. Select fields</div>}
      </div>
    </div>
  );
};
