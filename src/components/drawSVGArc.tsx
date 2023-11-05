export function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}
export function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {

  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
  ].join(" ");

  return d;
}
export function degrees_to_radians(deg: number) {
  return (deg * Math.PI) / 180;
}

export function maping_value(x: number, in_min: number, in_max: number,out_min: number,out_max: number){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}