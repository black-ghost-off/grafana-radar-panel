import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
import { getStyles } from './getStyles';
import { maping_value } from './drawSVGArc';
import { describeArc } from './drawSVGArc';
import { degrees_to_radians } from './drawSVGArc';


interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  let r = (height>width?width/2:height/2)/100*90;
  const options_as = [];
  let start = -30;
  let stop = 30;
  let step = 5;
  let offset = 180;
  let scale_range = 1;
  let x_offset = 0;
  let y_offset = 270;
  let scale_size = 2;
  let zero_offset = 15;
  let distance_line_start = 0;
  let distance_line_end = 100;
  let distance_line_step = 5;

  for (let distance_line = distance_line_start + zero_offset; distance_line <= distance_line_end; distance_line += distance_line_step){
    options_as.push(<path d={describeArc(0, 0, maping_value(distance_line, 0, 100, 0, r*scale_size), start*scale_range, stop*scale_range)} stroke={theme.colors.primary.shade} fillOpacity={0}></path>);
  }
  
  for (let deg = start; deg <= stop; deg+=step) {
    let deg_proc = -((deg * scale_range) + offset);
    options_as.push(<line x1={(r / 100 * zero_offset)*Math.sin(degrees_to_radians(deg_proc)) * scale_size} y1={(r / 100 * zero_offset)*Math.cos(degrees_to_radians(deg_proc)) * scale_size} x2={r*Math.sin(degrees_to_radians(deg_proc)) * scale_size} y2={r*Math.cos(degrees_to_radians(deg_proc)) * scale_size} stroke={theme.colors.primary.shade} />);
    options_as.push(<text x={r*Math.sin(degrees_to_radians(deg_proc)) * scale_size} y={r*Math.cos(degrees_to_radians(deg_proc)) * scale_size} className={styles.radar_degs_nums}>{deg}</text>);        
  }  

  let data_len = data.series[0].fields[1].values.length>data.series[1].fields[1].values.length?data.series[0].fields[1].values.length:data.series[1].fields[1].values.length;

  console.log(data_len);

  for (let dots = 0; dots < data_len; dots++){
    let x_c = maping_value(data.series[1].fields[1].values[dots], 0, 100, zero_offset, r * scale_size) * Math.sin(maping_value(degrees_to_radians(data.series[0].fields[1].values[dots]),0, 100, start, stop));
    let y_c = maping_value(data.series[1].fields[1].values[dots], 0, 100, zero_offset, r * scale_size) * Math.cos(maping_value(degrees_to_radians(data.series[0].fields[1].values[dots]),0, 100, start, stop));
    options_as.push(<circle cx={maping_value(data.series[1].fields[1].values[dots], 0, 100, 0, width)} cy={maping_value(degrees_to_radians(data.series[0].fields[1].values[dots]),0, 100, 0, height)} r="1" fill='white' />);
    // console.log(data.series[1].fields[1].values[dots]);
  }

  console.log(data);

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
      <svg
        className={styles.svg}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`-${(width / 2) + x_offset} -${(height / 2) + y_offset} ${width} ${height}`}
      >
        <g>
        {options_as}
        </g>
      </svg>

      <div className={styles.textBox}>
        {options.showSeriesCount && <div>Number of series: {data.series.length}</div>}
        <div>Text option value: {describeArc(50, 50, 10, 0, 90)}</div>
      </div>
    </div>
  );
};
