import React from 'react';
import { PanelProps } from '@grafana/data';
import { TimeSeries, TooltipPlugin, TooltipDisplayMode, ZoomPlugin } from '@grafana/ui';
import { SimpleOptions } from '../../types';
import { testIds } from '../testIds';

interface Props extends PanelProps<SimpleOptions> {}

export function SimplePanel({
  options,
  data,
  width,
  height,
  timeZone,
  timeRange,
  onChangeTimeRange,
  replaceVariables,
}: Props) {
  console.log('Panel rendered. ✔️');
  console.log(data.series)

  return (
    <div data-testid={testIds.panel.container}>
      <div>
        <strong>Variable: </strong>
        {replaceVariables('"$myVariable"')}
      </div>
      <TimeSeries
        width={width}
        height={height}
        timeRange={timeRange}
        timeZone={timeZone}
        frames={data.series}
        legend={options.legend}
      >
      </TimeSeries>
    </div>
  );
}
