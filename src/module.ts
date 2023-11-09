import { PanelPlugin } from '@grafana/data'; //

import { Panel } from './Panel';
import { Options } from './types';

export const plugin = new PanelPlugin<Options>(Panel)
  // .useFieldConfig()
  .setPanelOptions((builder) => {
    builder
    .addBooleanSwitch({
      path: 'is360degrees',
      name: 'Is radar have 360 degrees',
      defaultValue: true,
    })
    .addSliderInput({
      path: 'StartDegree',
      name: 'Start degree',
      defaultValue: -90,
      settings: {
        min: -179,
        max: 179
      },
      showIf: (config) => !(config.is360degrees),
    })
    .addSliderInput({
      path: 'EndDegree',
      name: 'End degree',
      defaultValue: 90,
      settings: {
        min: -179,
        max: 179
      },
      showIf: (config) => !(config.is360degrees),
    })
    .addSliderInput({
      path: 'ScaleRange',
      name: 'Scale degree size range',
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
      name: 'How many degree lines',
      defaultValue: 5,
      settings: {
        min: 1,
        max: 16,
      },
    })  
    .addSliderInput({
      path: 'StepsDistance',
      name: 'How many distance lines',
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
      name: 'Rotate radar view',
      defaultValue: 0,
      settings: {
        min: 0,
        max: 360,
      },
    })
    .addSliderInput({
      path: 'ScaleSize',
      name: 'Scale radar view',
      defaultValue: 1,
      settings: {
        min: 0.5,
        max: 1.999,
        step: 0.1
      },
    })
    .addSliderInput({
      path: 'XMove',
      name: 'Move the radar in the X axis',
      defaultValue: 0,
      settings: {
        min: -100,
        max: 100,
        step: 1
      },
    })
    .addSliderInput({
      path: 'YMove',
      name: 'Move the radar in the Y axis',
      defaultValue: 0,
      settings: {
        min: -100,
        max: 100,
        step: 1
      },
    })
    .addRadio({
      path: 'GradientSource',
      name: 'Dots gradient Source',
      defaultValue: 'Color',
      settings: {
        options: [
          {
            value: 'Color',
            label: 'Color',
          },
          // {
          //   value: 'Time',
          //   label: 'Time',
          // },
          {
            value: 'Gradient',
            label: 'Gradient',
          },
        ],
      },
    })
    .addTextInput({
      path: 'Gradient',
      name: "Dots color",
      defaultValue: "#ffffff #000000",
      showIf: (config: Options) => config.GradientSource !== "Color",
    })
    .addColorPicker({
      path: 'DotsColor',
      name: "Dots color",
      defaultValue: '#ffffff',
      showIf: (config: Options) => config.GradientSource === "Color",
    })
    .addSliderInput({
      path: 'DotsSize',
      name: "Dots size",
      defaultValue: 3,
      settings: {
        min: 0.1,
        max: 10,
        step: 0.1
      }
    })
    .addFieldNamePicker({
      path: "DegreesField",
      name: "Degrees Field",
    })
    .addFieldNamePicker({
      path: "DistanceField",
      name: "Distance Field",
    })
    .addFieldNamePicker({
      path: "PowerField",
      name: "Power Field",
      showIf: (config: Options) => config.GradientSource !== "Color",
    })
  })
  // .setNoPadding()
