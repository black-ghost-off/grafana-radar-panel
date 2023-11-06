import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './Panel';
import { min } from 'lodash';
import { config } from 'process';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addBooleanSwitch({
      path: 'is360degrees',
      name: 'Is radar have 360 degrees',
      defaultValue: true,
    })
    .addSliderInput({
      path: 'StartDegree',
      name: 'Series counter size',
      defaultValue: -90,
      settings: {
        min: -179,
        max: 179
      },
      showIf: (config) => !(config.is360degrees),
    })
    .addSliderInput({
      path: 'EndDegree',
      name: 'Series counter size',
      defaultValue: 90,
      settings: {
        min: -179,
        max: 179
      },
      showIf: (config) => !(config.is360degrees),
    })
    .addSliderInput({
      path: 'ScaleRange',
      name: 'Series counter size',
      defaultValue: 1,
      settings: {
        min: 0.5,
        max: 3,
        step: 0.1
      },
      showIf: (config) => !(config.is360degrees),
    })
    .addSliderInput({
      path: 'StepsDegrees',
      name: 'Series counter size',
      defaultValue: 5,
      settings: {
        min: 1,
        max: 16,
      },
    })  
    .addSliderInput({
      path: 'StepsDistance',
      name: 'Series counter size',
      defaultValue: 4,
      settings: {
        min: 1,
        max: 8,
      },
    })
    // .addSliderInput({
    //   path: 'RangeStartOffset',
    //   name: 'Series counter size',
    //   defaultValue: 1,
    //   settings: {
    //     min: 0,
    //     max: 99
    //   },
    // })
    .addSliderInput({
      path: 'RotateRadar',
      name: 'Series counter size',
      defaultValue: 1,
      settings: {
        min: 0,
        max: 360
      },
    })
    .addSliderInput({
      path: 'ScaleSize',
      name: 'Series counter size',
      defaultValue: 1,
      settings: {
        min: 0.5,
        max: 1.999,
        step: 0.1
      },
    })
    .addSliderInput({
      path: 'XMove',
      name: 'Series counter size',
      defaultValue: 1,
      settings: {
        min: -100,
        max: 100,
        step: 1
      },
    })
    .addSliderInput({
      path: 'YMove',
      name: 'Series counter size',
      defaultValue: 1,
      settings: {
        min: -100,
        max: 100,
        step: 1
      },
    })
});
