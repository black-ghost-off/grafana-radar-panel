export interface Options {
  is360degrees: boolean;

  StartDegree: number;
  EndDegree: number;
  StepsDegrees: number;

  StepsDistance: number;

  // RangeStartOffset: number;

  RotateRadar: number;
  ScaleRange: number;
  ScaleSize: number;

  XMove: number;
  YMove: number;
  colorMode: any;

  GradientSource: string;

  Gradient: string;
  DotsColor: string;
  DegreesField: string;
  DistanceField: string;
  PowerField: string;
}
