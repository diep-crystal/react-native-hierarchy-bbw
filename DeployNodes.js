import React from 'react';
import _ from 'lodash'
import { G, Text, Rect, Circle } from 'react-native-svg'

export function DeployNodes(nodes, nodeWitdh, rootY) {
  const rectNodes = _.map(nodes, function (n, index) {
    return (<G key={'tree_' + index}>
      <Circle
        r="4"
        x={n.x}
        y={n.y}
        fill="#1AAC19"
      />
      <Rect
        x={n.x}
        y={n.y}
        width={nodeWitdh}
        height={1}
        stroke={rootY > n.y ? '#be4468' : '#ab68e3'}
      />
      {n.name && <Text
        fontSize={10}
        x={n.x + 10} y={n.y - (n.date ? 30 : 15)} >{n.name}</Text>}
      {n.date && <Text
        fontSize={10}
        x={n.x + 10} y={n.y - 15} >{n.date}</Text>}

    </G>)
  })

  return rectNodes
}