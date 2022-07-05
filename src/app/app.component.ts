import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as lg from 'litegraph.js';
import { INodeInputSlot, LGraphNode } from 'litegraph.js';

class Test extends lg.LGraphNode {
  constructor() {
    super();
    this.title = 'Multiplication';
    // this.addInput('A', 'number');
    // this.addInput('B', 'number');
    // this.addInput('A', 'number');
    // this.addInput('B', 'number');
    // this.addOutput('A*B', 'number');
    // this.addOutput('A*B', 'number');
    // this.addOutput('A*B', 'number');
    // this.addOutput('A*B', 'number');
    this.properties = { precision: 0.1 };
  }
  override onExecute() {
    // console.log('ttttttttt')
    var A = this.getInputData(0);
    if (A === undefined) A = 0;
    var B = this.getInputData(1);
    if (B === undefined) B = 0;
    this.setOutputData(0, A + B);
  }

  // https://github.com/jagenjo/litegraph.js/blob/master/guides/README.md#node-widgets
  override onConnectInput(
    inputIndex: number,
    outputType: lg.INodeOutputSlot['type'],
    outputSlot: lg.INodeOutputSlot,
    outputNode: LGraphNode,
    outputIndex: number
  ): boolean {
    console.log(
      'connect input',
      inputIndex,
      outputType,
      outputSlot,
      outputNode,
      outputIndex
    );
    return true;
  }

  override onConnectOutput?(
    outputIndex: number,
    inputType: INodeInputSlot['type'],
    inputSlot: INodeInputSlot,
    inputNode: LGraphNode,
    inputIndex: number
  ): boolean {
    console.log(
      'connect output',
      inputIndex,
      inputType,
      inputSlot,
      inputNode,
      outputIndex
    );
    return true;
  }

  // onMouseDown?(
  //   event: MouseEvent,
  //   pos: Vector2,
  //   graphCanvas: LGraphCanvas
  // ): void;
  // onMouseMove?(
  //   event: MouseEvent,
  //   pos: Vector2,
  //   graphCanvas: LGraphCanvas
  // ): void;
  // onMouseUp?(
  //   event: MouseEvent,
  //   pos: Vector2,
  //   graphCanvas: LGraphCanvas
  // ): void;
  // onMouseEnter?(
  //   event: MouseEvent,
  //   pos: Vector2,
  //   graphCanvas: LGraphCanvas
  // ): void;
  // onMouseLeave?(
  //   event: MouseEvent,
  //   pos: Vector2,
  //   graphCanvas: LGraphCanvas
  // ): void;
}

//https://github.com/jagenjo/litegraph.js/blob/master/guides/README.md#node-widgets
// plugin - macro
interface Param {
  name: string;
  type: string;
  index: number;
}
interface Node {
  id: number;
  name: string;
  params: Param[];
  pos: [number, number]
  type: string; // this need to be a specific type like basic/sum, need to find out how to create a custom
}
interface Link {
  id: number;
  sourceId: number;
  sourceIndex: number;
  targetId: number;
  targetIndex: number;

  source?: lg.LGraphNode;
  target?: lg.LGraphNode;
}
interface Graph {
  nodes: Node[];
  links: Link[];
}

/*Node Widgets
You can add widgets inside the node to edit text, values, etc.

To do so you must create them in the constructor by calling node.addWidget, the returned value is the object containing all the info about the widget, it is handy to store it in case you want to change the value later from code.*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'light-graph';
  @ViewChild('graph', { static: true }) graph!: ElementRef;
  ngOnInit() {
    const data: Graph = {
      nodes: [
        {
          id: 0,
          name: 'First Node',
          pos: [100, 100],
          type: 'basic/sum',
          params: [
            {
              name: 'Aa',
              type: 'number',
              index: 0,
            },
            {
              name: 'Bb',
              type: 'number',
              index: 0,
            },
            {
              name: 'Cc',
              type: 'number',
              index: 0,
            },
          ],
        },
        {
          id: 1,
          name: 'Second Node',
          pos: [250, 250],
          type: 'basic/sum',
          params: [
            {
              name: 'Bb',
              type: 'number',
              index: 0,
            },
            {
              name: 'Cc',
              type: 'number',
              index: 0,
            },
          ],
        },
        {
          id: 2,
          name: 'Third Node',
          pos:[500, 500],
          type: 'basic/sum',
          params: [
            {
              name: 'Aa',
              type: 'number',
              index: 0,
            },
            {
              name: 'Cc',
              type: 'number',
              index: 0,
            },
          ],
        },
      ],
      links: [{
        id: 0,
        sourceId: 0,
        sourceIndex: 1,
        targetId: 1,
        targetIndex: 1
      },{
        id: 1,
        sourceId: 0,
        sourceIndex: 2,
        targetId: 1,
        targetIndex: 0
      },{
        id: 3,
        sourceId: 1,
        sourceIndex: 0,
        targetId: 2,
        targetIndex: 0
      }],
    };
    const graph = new lg.LGraph();
    const canvas = new lg.LGraphCanvas(this.graph.nativeElement, graph);

   
    lg.LiteGraph.registerNodeType('basic/sum', Test);

    const graphNodes: lg.LGraphNode[] = [];
    data.nodes.forEach(n => {
      const node = lg.LiteGraph.createNode(n.type);
      node.pos = n.pos;
      node.title = n.name;
      node.id = n.id;
      n.params.forEach( p => {
        node.addInput(p.name, p.type);
        node.addOutput(p.name, p.type);
      })
      graph.add(node);
      graphNodes.push(node);
    })
    data.links.forEach(l => {
      const source = graphNodes.find(x => x.id === l.sourceId);
      const target = graphNodes.find(x => x.id === l.targetId);
      if ( source && target){
        source.connect(l.sourceIndex, target, l.targetIndex);
      }
    })
    // check graph overview

    // https://tamats.com/projects/litegraph/editor/
      // it has spit view (multiview)
      // right click menu
      

    // var node_const = lg.LiteGraph.createNode('basic/sum');
    // node_const.pos = [200, 200];
    // graph.add(node_const);
    // //node_const.setValue(4.5);

    // var node_watch = lg.LiteGraph.createNode('basic/sum');
    // node_watch.pos = [700, 200];
    // node_watch.title = 'my testetste';
    // graph.add(node_watch);

    // var node_watch2 = lg.LiteGraph.createNode('basic/sum');
    // node_watch2.pos = [800, 300];
    // graph.add(node_watch2);

    // node_const.connect(0, node_watch, 0);

    graph.start();
  }
}
