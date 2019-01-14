import React from 'react';
import _ from 'lodash'
import { JoinPaths } from './ZigZagUtil'
import { Path } from 'react-native-svg'

export function NodeCurves(links, rootY) {
  const nodePath = _.map(links, function (d, i) {
    return <Path key={'curves_' + i} d={JoinPaths(d)}
      fill="none"
      strokeWidth={2}
      stroke={rootY > d.target.y ? '#be4468' : '#ab68e3'} />
  })

  return nodePath
}