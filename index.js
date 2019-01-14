import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Animated
} from 'react-native';

import Svg, { Circle, G, Path, Text, Rect } from 'react-native-svg'
import * as d3 from "d3";
import _ from 'lodash'
import { flatten } from './FlatNodes'
import { NodeCurves } from './ConstructCurves'
import { DeployNodes } from './DeployNodes'
import { SiblingCurves } from './SiblingCurves'


var { height, width } = Dimensions.get('window');
var margin = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
},
  curves, siblingpath, rectNodes

export default class AwesomeHierarchyGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scale: new Animated.Value(0)
    }
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    this.animate();
  }

  drawTree() {
    const { root, siblings } = this.props

    var allNodes = flatten(root);

    var tree = d3.layout.tree().size([width, height]),
      nodes = tree.nodes(root),
      links = tree.links(nodes);
    
    let rootY = 0

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
      // if(n.deep > deep){
      //   deep = n.deep
      // }
      return _node
    })

    // let newLinks = tree.links(nodes)

    // console.log('width = ', width)
    // console.log('height = ', height)
    // console.log('tree = ', tree)
    console.log('nodes = ', nodes)
    // console.log('newNodes = ', newNodes)
    console.log('rootY = ', rootY)
    // console.log('newLinks = ', newLinks)
    let nodeWitdh = nodes.length > 1 ? nodes[1].x - nodes[0].x : 0
    curves = NodeCurves(links, rootY)
    // curves = NodeCurves(newLinks)
    // siblingpath = SiblingCurves(siblings,allNodes)
    // rectNodes = DeployNodes(nodes, height / width)
    rectNodes = DeployNodes(nodes, nodeWitdh, rootY)
    // console.log('rectNodes = ', rectNodes)
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
    this.drawTree()
    return (
      <View>
        <Animated.View style={{ opacity: this.state.scale }}>
          <ScrollView>
            <ScrollView horizontal>
              <Svg width={1000} height={height}>
                {/* <G > */}
                {/* { siblingpath } */}
                {rectNodes}
                {curves}
                {/* </G> */}
              </Svg>
            </ScrollView>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
