import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

interface Node {
  id: string;
  topic: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  simulation: any = null;
  svg: any;
  width: number = 0;
  height: number = 0;
  zoomHandler: any;
  zoomTransform: any = d3.zoomIdentity;
  docsAmount: number = 50;
  topicAmount: number = 3;
  probability: number = 0.05
  nodeRadiusNormal: number = 6;
  nodeRadiusHover: number = this.nodeRadiusNormal + 3;
  linkStroke: string = "#cbcbcb";
  linkStrokeOpacity: number = 0.5;
  linkStrokeWidth: number = 3;
  zoomScaleExtent: [number, number] = [0.1, 2];
  centerForceStrength: number = -(this.docsAmount);
  resizeTransitionDuration: number = 500;
  resizeForceCenterDuration: number = 200;
  gravityStrength : number = 0.05;

  ngOnInit(): void {
    this.createChart();
    this.handleResize();
  }

  handleVariableChange(): void {
    // Prima di ricreare il grafico, rimuovi il grafico esistente se presente
    if (this.svg) {
      this.svg.selectAll("*").remove();
    }

    // Poi ricrea il grafico
    this.createChart();
  }


  createChart(): void {
    const data = this.generateData(this.docsAmount, this.topicAmount, this.probability);

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const color = d3.scaleOrdinal(d3.schemeDark2);

    const links = data.links;
    const nodes = data.nodes;

    const dragstarted = (event: any, d: any): void => {
      if (!event.active) this.simulation.alphaTarget(0.1).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (event: any, d: any): void => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragended = (event: any, d: any): void => {
      if (!event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    this.simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink().links(links).id(d => (d as any).id))
      .force("charge", d3.forceManyBody().strength(this.centerForceStrength))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .force("collide", d3.forceCollide())
      .force("gravity", d3.forceRadial(0, this.width / 2, this.height / 2).strength(this.gravityStrength))
      .on("tick", ticked)
      .restart();

    this.svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height])
      .attr("style", "width: 100%; height: 100%; position: absolute; top: 0; left: 0;");

    this.zoomHandler = d3.zoom()
      .scaleExtent(this.zoomScaleExtent)
      .on("zoom", this.zoomed);

    const g = this.svg.append("g");

    this.svg.call(this.zoomHandler)
      .call(this.zoomHandler.transform, d3.zoomIdentity);

    const link = g.append("g")
      .attr("stroke", this.linkStroke)
      .attr("stroke-opacity", this.linkStrokeOpacity)
      .selectAll()
      .data(links)
      .join("line")
      .attr("stroke-width", this.linkStrokeWidth);

    const node = g.append("g")
      .selectAll()
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => this.nodeRadiusNormal)
      .attr("fill", (d: any) => color((d as any).topic))
      .on("click", (event: any, d: any) => this.nodeClicked(d))
      .on("mouseover", (event: any, d: any) => this.nodeMouseOver(event, d))
      .on("mouseout", (event: any, d: any) => this.nodeMouseOut(event, d))
      .on("contextmenu", (event: any) => {
        event.preventDefault();
        this.handleResize();
      })
      .attr("style", "cursor: pointer")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    function ticked(): void {
      link.attr("x1", (d: any) => (d.source as any).x)
        .attr("y1", (d: any) => (d.source as any).y)
        .attr("x2", (d: any) => (d.target as any).x)
        .attr("y2", (d: any) => (d.target as any).y);

      node.attr("cx", (d: any) => (d as any).x)
        .attr("cy", (d: any) => (d as any).y);
    }
  }

  generateData(numDocuments: number, numTopics: number, similarityProbability: number) {
    const data: any = {
      nodes: [],
      links: []
    };

    for (let i = 1; i <= numDocuments; i++) {
      const topic = Math.ceil(Math.random() * numTopics);
      data.nodes.push({ id: "Document " + i, topic: topic });
    }

    for (let i = 0; i < numDocuments; i++) {
      const sourceDocument = "Document " + (i + 1);
      const sourceTopic = data.nodes[i].topic;

      for (let j = i + 1; j < numDocuments; j++) {
        const targetDocument = "Document " + (j + 1);
        const targetTopic = data.nodes[j].topic;

        if (Math.random() < similarityProbability) {
          data.links.push({ source: sourceDocument, target: targetDocument });
        }
      }
    }

    return data;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.handleResize();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent): void {
    if (event.key === 'f' || event.key === 'F') {
      this.center();
    }
  }

  private handleResize(): void {
    this.width = this.chartContainer.nativeElement.offsetWidth;
    this.height = window.innerHeight;

    this.svg.transition().duration(this.resizeTransitionDuration)
      .attr("width", this.width).attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height]);

    if (this.simulation) {
      this.simulation.force("center", d3.forceCenter(this.width / 2, this.height / 2)).restart().alpha(1);
    }
  }

  private zoomed = (event: any): void => {
    const { transform } = event;
    this.svg.selectAll("g").attr("transform", transform);
  }

  private nodeClicked(nodeData: any): void {
    console.log("Clicked Node:", nodeData);
  }

  private nodeMouseOver = (event: any, d: any): void => {
    d3.select(event.target)
      .transition()
      .duration(this.resizeForceCenterDuration)
      .attr("r", this.nodeRadiusHover);

    const linkedNodes = this.svg.selectAll("line")
      .filter((linkData: any) => linkData.source === d || linkData.target === d)
      .data()
      .flatMap((linkData: any) => [linkData.source, linkData.target]);

    this.svg.selectAll("circle")
      .filter((nodeData: any) => linkedNodes.includes(nodeData))
      .transition()
      .duration(this.resizeForceCenterDuration)
      .attr("r", this.nodeRadiusHover)

    this.svg.selectAll("line")
      .filter((linkData: any) => linkData.source === d || linkData.target === d)
      .attr("stroke", "black")
  }

  private nodeMouseOut = (event: any, d: any): void => {
    d3.select(event.target)
      .transition()
      .duration(this.resizeForceCenterDuration)
      .attr("r", this.nodeRadiusNormal);

    const linkedNodes = this.svg.selectAll("line")
      .filter((linkData: any) => linkData.source === d || linkData.target === d)
      .data()
      .flatMap((linkData: any) => [linkData.source, linkData.target]);

    this.svg.selectAll("circle")
      .filter((nodeData: any) => linkedNodes.includes(nodeData))
      .transition()
      .duration(this.resizeForceCenterDuration)
      .attr("r", this.nodeRadiusNormal)

    this.svg.selectAll("line")
      .filter((linkData: any) => linkData.source === d || linkData.target === d)
      .attr("stroke", this.linkStroke);
  }

  private center(): void {
    this.svg.transition().duration(this.resizeTransitionDuration).call(this.zoomHandler.transform, d3.zoomIdentity);
    this.simulation.force("center", d3.forceCenter(this.width / 2, this.height / 2)).restart();
  }
}
