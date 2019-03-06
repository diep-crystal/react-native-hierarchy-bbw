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
import moment from "moment";

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

  // getHeight(root){
  //   let max = 0;
  //   for (Node<T> childNode  : root.getChildren()) {
  //       let height = getHeight(childNode);
  //       if (height > max)
  //           max = height;
  //   }
  //   return max + 1;
  // }


  drawTree() {
    const { root } = this.props
    const tmpNodeWitdh = width / 4
    let tmpRoot = _.cloneDeep(root)

    //fit witdh of hierarchy
    var tmpTree = d3.layout.tree().size([width, height]),
      tmpNodes = tmpTree.nodes(tmpRoot)
    let depthLevel = 0
    _.map(tmpNodes, function (n, index) {
      if (depthLevel < n.depth) {
        depthLevel = n.depth
      }
    })

    // console.log('tmpNodes = ', tmpNodes)
    // console.log('nodeWitdh = ', nodeWitdh)

    hierarchyWidth = tmpNodeWitdh * (depthLevel + 1) + 20
    // if (tmpNodes.length == 0) {
    //   hierarchyWidth = 0
    // } else {
    //   hierarchyWidth = nodeWitdh * (depthLevel + 1) + 20
    // }

    //
    var tree = d3.layout.tree().size([hierarchyWidth, hierarchyWidth]),
      nodes = tree.nodes(root),
      links = tree.links(nodes);

    let rootY = 0
    //remove redudant map
    _.map(nodes, function (n, index) {
      let _node = n
      _node.parent = null
      _node.children = null

      let tmp = _.cloneDeep(n.x)
      n.x = n.y / 2
      n.y = tmp

      if (index == 0) {
        rootY = tmp
      }

      _node.date = moment(n.date).format('DD MMM YYYY')

      return _node
    })

    let nodeWitdh = nodes.length > 1 ? nodes[1].x - nodes[0].x : (nodes.length == 1 ?  width / 4 : 0)

    // console.log('nodes = ', nodes)
    // console.log('nodeWitdh = ', nodeWitdh)
    // console.log('depthLevel = ', depthLevel)
    // console.log('hierarchyWidth = ', hierarchyWidth)
    // console.log('width = ', width)
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
                {curves}
                {rectNodes}
              </Svg>
            </ScrollView>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}
