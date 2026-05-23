import { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import type { AppStyles } from '../../../app/appTypes';
import type { CalculatorTheme } from '../../theme';
import { GraphCanvas } from '../canvas/components/GraphCanvas';
import { GraphControls } from '../canvas/components/GraphControls';
import { EquationList } from '../equations/components/EquationList';
import { useGraphingCalculator } from '../equations/hooks/useGraphingCalculator';

type GraphingScreenProps = {
  styles: AppStyles;
  theme: CalculatorTheme;
};

export function GraphingScreen({ styles }: GraphingScreenProps) {
  const [graphSize, setGraphSize] = useState({ width: 1, height: 1 });
  const graphing = useGraphingCalculator(graphSize.width);

  function handleGraphLayout(event: LayoutChangeEvent) {
    const { height, width } = event.nativeEvent.layout;
    setGraphSize({ height: Math.max(1, height), width: Math.max(1, width) });
  }

  return (
    <View style={styles.graphingRoot}>
      <View style={styles.graphingBody}>
        <EquationList
          canAddEquation={graphing.canAddEquation}
          equations={graphing.plottedEquations}
          onAdd={graphing.addEquation}
          onDelete={graphing.deleteEquation}
          onToggle={graphing.toggleEquation}
          onUpdate={graphing.updateEquation}
          styles={styles}
        />

        <View onLayout={handleGraphLayout} style={styles.graphArea}>
          <GraphCanvas
            equations={graphing.plottedEquations}
            height={graphSize.height}
            styles={styles}
            viewport={graphing.viewport}
            width={graphSize.width}
          />
          <GraphControls
            onReset={graphing.resetGraph}
            onZoomIn={graphing.zoomIn}
            onZoomOut={graphing.zoomOut}
            styles={styles}
          />
        </View>
      </View>
    </View>
  );
}
