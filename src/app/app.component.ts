import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
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
  docsAmount: number = 30;
  topicAmount: number = 2;

  ngOnInit(): void {
    this.createChart();
    this.handleResize();
  }

  createChart(): void {
    const data = this.generateData(this.docsAmount, this.topicAmount, 0.05);

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const links = data.links;
    const nodes = data.nodes;

    this.simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => (d as any).id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .on("tick", ticked)
      .restart();

    this.svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height])
      .attr("style", "width: 100%; height: 100%; position: absolute; top: 0; left: 0;");

    this.zoomHandler = d3.zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", this.zoomed);

    const g = this.svg.append("g");

    this.svg.call(this.zoomHandler)
      .call(this.zoomHandler.transform, d3.zoomIdentity);

    const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 1)
      .selectAll()
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    const node = g.append("g")
      .selectAll()
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", (d: any) => color((d as any).topic))
      .on("click", (event: any, d: any) => this.nodeClicked(d))
      .on("mouseover", (event: any, d: any) => this.nodeMouseOver(event, d))
      .on("mouseout", (event: any, d: any) => this.nodeMouseOut(event, d))
      .on("contextmenu", (event: any) => {
        event.preventDefault();
        this.handleResize();
      })
      .attr("style", "cursor: pointer");

    function ticked(): void {
      link
        .attr("x1", (d: any) => (d.source as any).x)
        .attr("y1", (d: any) => (d.source as any).y)
        .attr("x2", (d: any) => (d.target as any).x)
        .attr("y2", (d: any) => (d.target as any).y);

      node
        .attr("cx", (d: any) => (d as any).x)
        .attr("cy", (d: any) => (d as any).y);
    }
  }

  generateData(numDocuments: number, numTopics: number, similarityProbability: number) {
    const data: any = {
      nodes: [],
      links: []
    };

    // Generate nodes (documents) and assign them a topic
    for (let i = 1; i <= numDocuments; i++) {
      const topic = Math.ceil(Math.random() * numTopics);
      data.nodes.push({ id: "Document " + i, topic: topic });
    }

    // Generate links between documents based on similarity probability
    for (let i = 0; i < numDocuments; i++) {
      const sourceDocument = "Document " + (i + 1);
      const sourceTopic = data.nodes[i].topic;

      for (let j = i + 1; j < numDocuments; j++) {
        const targetDocument = "Document " + (j + 1);
        const targetTopic = data.nodes[j].topic;

        // If documents have a similarity relationship, connect them
        if (Math.random() < similarityProbability && (sourceTopic === targetTopic || Math.random() < 0.5)) {
          // Connect documents if they have similar topics or randomly with 50% probability
          data.links.push({ source: sourceDocument, target: targetDocument, value: 1 });
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
      // Chiamata alla funzione o azione desiderata quando viene premuta la lettera "F"
      this.center();
    }
  }
  private handleResize(): void {
    this.width = this.chartContainer.nativeElement.offsetWidth;
    this.height = window.innerHeight;

    this.svg.attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height]);

    if (this.simulation) {
      this.simulation.force("center", d3.forceCenter(this.width / 2, this.height / 2));
      this.simulation.restart();
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
      .duration(200)
      .attr("r", 15);
    this.changeLinkStyle(d, "black");
  }

  private nodeMouseOut = (event: any, d: any): void => {
    d3.select(event.target)
      .transition()
      .duration(200)
      .attr("r", 10);
    this.changeLinkStyle(d, "#999");
  }

  private center(): void {
    this.svg.transition().duration(500).call(this.zoomHandler.transform, d3.zoomIdentity);
    this.simulation.force("center", d3.forceCenter(this.width / 2, this.height / 2)).restart();
  }

  private changeLinkStyle(node: any, color: string): void {
    const linkedNodes = new Set();
    const queue = [node];

    while (queue.length > 0) {
      const currentNode = queue.pop();
      linkedNodes.add(currentNode);

      this.svg.selectAll("line")
        .filter((d: any) => d.source === currentNode || d.target === currentNode)
        .attr("stroke", color)
        .each((d: any) => {
          const linkedNode = d.source === currentNode ? d.target : d.source;
          if (!linkedNodes.has(linkedNode)) {
            queue.push(linkedNode);
          }
        });
    }
  }
}
