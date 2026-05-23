export type GraphEquation = {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
  error?: string;
};

export type GraphViewport = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type GraphPoint = {
  x: number;
  y: number;
};

export type ParsedGraphExpression = {
  kind: "explicit";
  source: string;
  evaluate: (x: number) => number;
};

export type PlottedEquation = GraphEquation & {
  points: GraphPoint[];
};
