import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  Animated
} from 'react-native';

import Svg from 'react-native-svg'
import * as d3 from "d3";
import _ from 'lodash'
import { NodeCurves } from './ConstructCurves'
import { DeployNodes } from './DeployNodes'

var { height, width } = Dimensions.get('window');
var curves, rectNodes
var hierarchyWidth = width

export default class AwesomeHierarchyGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scale: new Animated.Value(0),
    }
    this.animate = this.animate.bind(this);
  }

  componentWillMount() {
    this.drawTree()
  }

  componentDidMount() {
    this.animate();
  }

  drawTree() {
    const { root } = this.props

    var tree = d3.layout.tree().size([width, height]),
      nodes = tree.nodes(root),
      links = tree.links(nodes);
    
    let rootY = 0
    let depthLevel = 0
    //remove redudant map
    _.map(nodes, function (n, index) {
      let _node = n
      _node.parent = null
      _node.children = null

      let tmp = _.cloneDeep(n.x)
      n.x = n.y/2
      n.y = tmp

      if(index == 0){
        rootY = tmp
      }
      if(depthLevel < n.depth){
        depthLevel = n.depth
      }
      return _node
    })

    let nodeWitdh = nodes.length > 1 ? nodes[1].x - nodes[0].x : 0
    hierarchyWidth = nodeWitdh * (depthLevel + 1) + 20
    curves = NodeCurves(links, rootY)
    rectNodes = DeployNodes(nodes, nodeWitdh, rootY)
  }

  animate() {
    Animated.stagger(10, [
      Animated.timing(this.state.scale,
        {
          toValue: 1,
          duration: 1000
        })
    ]).start(this.animate)
  }

  render() {
    return (
      <View>
        <Animated.View style={{ opacity: this.state.scale }}>
          <ScrollView>
            <ScrollView horizontal>
              <Svg width={hierarchyWidth} height={height}>
                {rectNodes}
                {curves}
              </Svg>
            </ScrollView>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}
