import React, { Component } from 'react';
import _ from 'lodash'
import { tx, ty, kx, ky } from './CoordinatePoints'
import Svg,{ G, Text, Rect } from 'react-native-svg'

export function DeployNodes(nodes, nodeWitdh, rootY)
{
  const rectNodes =    _.map(nodes,function (n,index) {
                              let text
                              if(n.name)
                              {
                                text = <Text
                                         fontSize={10}
                                         x={tx(n)} y={ty(n)} >{ n.name }</Text>
                                 return (<G key={'tree_' + index}>
                                          <Rect
                                            x={n.x}
                                            y={n.y}
                                            width={nodeWitdh}
                                            height={1}
                                            stroke={rootY > n.y ? '#be4468' : '#ab68e3'}
                                        /> 
                                        {text}
                                      </G>)
                              }        
                            })
                            
  return rectNodes                            
}