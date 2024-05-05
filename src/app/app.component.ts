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
  width: number = 0; // Larghezza predefinita del grafico
  height: number = 0; // Altezza predefinita del grafico
  zoomHandler: any;
  zoomTransform: any = d3.zoomIdentity;
  docsAmount: number = 50; // Numero predefinito di documenti
  topicAmount: number = 2; // Numero predefinito di argomenti
  nodeRadiusNormal: number = 10; // Raggio normale dei nodi
  nodeRadiusHoverIncrement: number = 6; // Incremento del raggio durante il mouseover
  linkStroke: string = "#b4b4b4"; // Colore predefinito dei link
  linkStrokeOpacity: number = 0.7; // Opacità predefinita dei link
  linkStrokeWidth: number = 4; // Larghezza predefinita dei link
  zoomScaleExtent: [number, number] = [0.1, 2]; // Intervallo di scala predefinito
  centerForceStrength: number = -(50); // Forza centrale predefinita
  resizeTransitionDuration: number = 500; // Durata predefinita della transizione durante il ridimensionamento
  resizeForceCenterDuration: number = 200; // Durata predefinita della transizione durante il recentraggio
  radiusImportanceRadius: number = 1; // Raggio di importanza per il calcolo del raggio dei nodi

  color = d3.scaleOrdinal(d3.schemeDark2);
  linkedNodesMap: Map<any, any[]> = new Map();
  linkedLinksMap: Map<any, any[]> = new Map();

  constructor() {}

  ngOnInit(): void {
    this.createChart();
    this.handleResize();

    // Aggiungi un listener per il clic sui nodi
    this.svg.selectAll("circle").on('click', (event: any, d: any) => {
      this.nodeClicked(event, d);
      event.stopPropagation(); // Ferma la propagazione del clic per evitare che venga interpretato come clic sul documento
    });

    // Aggiungi un listener per il clic sul documento
    document.addEventListener('click', () => {
      this.resetNodeOpacity();
    });
  }

  createChart(): void {
    const data = this.generateData(this.docsAmount, this.topicAmount, 0.03);

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const links = data.links;
    const nodes = data.nodes;

    const dragstarted = (event: any, d: any): void => {
      if (!event.active) this.simulation.alphaTarget(0.05).restart();
      d.fx = d.x;
      d.fy = d.y;
      this.simulation.force("charge", null);
    };

    const dragged = (event: any, d: any): void => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragended = (event: any, d: any): void => {
      if (!event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      this.simulation.force("charge", d3.forceManyBody().strength(this.centerForceStrength));
    };

    this.simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => (d as any).id))
      .force("charge", d3.forceManyBody().strength(this.centerForceStrength))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .force("collide", d3.forceCollide())
      .force("gravity", d3.forceRadial(0, this.width / 2, this.height / 2).strength(0.1)) // Aggiungi la forza di gravità
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
      .attr("r", (d: any) => this.calculateNodeRadius(d))
      .attr("fill", (d: any) => this.color((d as any).topic))
      .on("click", (event: any, d: any) => this.nodeClicked(event, d))
      .on("mouseover", (event: any, d: any) => this.nodeMouseOver(event, d))
      .on("mouseout", (event: any, d: any) => this.nodeMouseOut(event, d))
      .attr("style", "cursor: pointer")
      .style('filter', 'drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.2))')
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

    for (const link of links) {
      const sourceNode = link.source;
      const targetNode = link.target;

      if (!this.linkedLinksMap.has(sourceNode)) {
        this.linkedLinksMap.set(sourceNode, []);
      }
      if (!this.linkedLinksMap.has(targetNode)) {
        this.linkedLinksMap.set(targetNode, []);
      }

      const sourceLinks = this.linkedLinksMap.get(sourceNode);
      const targetLinks = this.linkedLinksMap.get(targetNode);

      if (sourceLinks && targetLinks) {
        sourceLinks.push(link);
        targetLinks.push(link);
      }
    }
  }

  generateData(numDocuments: number, numTopics: number, similarityProbability: number) {
    const data: any = {
      nodes: [],
      links: []
    };

    const topics = Array.from({ length: numTopics }, (_, i) => i + 1);

    for (let i = 1; i <= numDocuments; i++) {
      const topic = topics[Math.floor(Math.random() * numTopics)];
      data.nodes.push({ id: "Document " + i, topic: topic });
    }

    for (let i = 0; i < numDocuments; i++) {
      const sourceDocument = "Document " + (i + 1);
      const sourceTopic = data.nodes[i].topic;

      for (let j = i + 1; j < numDocuments; j++) {
        const targetDocument = "Document " + (j + 1);
        const targetTopic = data.nodes[j].topic;

        if (Math.random() < similarityProbability && (sourceTopic === targetTopic || Math.random() < 0.5)) {
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
      this.center();
    }
  }

  private handleResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.svg.transition().duration(this.resizeTransitionDuration)
      .attr("width", this.width).attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height]);

    if (this.simulation) {
      this.simulation.force("center", d3.forceCenter(this.width / 2, this.height / 2)).restart();
    }
  }

  private zoomed = (event: any): void => {
    const { transform } = event;
    this.svg.selectAll("g").attr("transform", transform);
  }

  private nodeClicked(event: any, nodeData: any): void {
    console.log("Clicked Node:", nodeData);

    // Seleziona i nodi primi figli e fratelli diretti del nodo cliccato
    const connectedNodes = this.getConnectedNodes(nodeData);
    const hasLinks = connectedNodes.length > 0;

    // Imposta l'opacità dei nodi primi figli e fratelli diretti solo se ci sono collegamenti
    this.svg.selectAll("circle")
      .transition()
      .duration(this.resizeForceCenterDuration)
      .style("opacity", (d: any) => {
        if (hasLinks) {
          return connectedNodes.includes(d) ? 1 : 0.2;
        } else {
          // Se il nodo è isolato, non lo opacizziamo
          return d === nodeData ? 1 : 0.2;
        }
      });

    // Imposta l'opacità dei link solo se ci sono collegamenti
    this.svg.selectAll("line")
      .transition()
      .duration(this.resizeForceCenterDuration)
      .style("opacity", (d: any) => {
        if (hasLinks) {
          return (d.source === nodeData || d.target === nodeData) ? 1 : 0.2;
        } else {
          // Se il nodo è isolato, non opacizziamo i link
          return 1;
        }
      });
  }

  private getConnectedNodes(nodeData: any): any {
    if (this.linkedNodesMap.has(nodeData)) {
      return this.linkedNodesMap.get(nodeData);
    } else {
      const connectedLinks = this.linkedLinksMap.get(nodeData);
      if (connectedLinks) {
        const connectedNodes = connectedLinks.flatMap((linkData: any) => [
          linkData.source,
          linkData.target
        ]);

        this.linkedNodesMap.set(nodeData, connectedNodes);
        return connectedNodes;
      } else {
        return [];
      }
    }
  }

  private nodeMouseOver = (event: any, d: any): void => {
    d3.select(event.target)
      .transition()
      .duration(this.resizeForceCenterDuration)
      .attr("r", (d: any) => this.calculateNodeRadius(d) + this.nodeRadiusHoverIncrement);

    const linkedNodes = this.getConnectedNodes(d);

    this.svg.selectAll("circle")
      .filter((nodeData: any) => linkedNodes.includes(nodeData))
      .transition()
      .duration(this.resizeForceCenterDuration)
      .attr("r", (d: any) => this.calculateNodeRadius(d) + this.nodeRadiusHoverIncrement);

    this.svg.selectAll("line")
      .filter((linkData: any) => linkData.source === d || linkData.target === d)
      .attr("stroke", "black");
  }

  private nodeMouseOut = (event: any, d: any): void => {
    d3.select(event.target)
      .transition()
      .duration(this.resizeForceCenterDuration)
      .attr("r", (d: any) => this.calculateNodeRadius(d));

    const linkedNodes = this.getConnectedNodes(d);

    this.svg.selectAll("circle")
      .filter((nodeData: any) => linkedNodes.includes(nodeData))
      .transition()
      .duration(this.resizeForceCenterDuration)
      .attr("r", (d: any) => this.calculateNodeRadius(d));

    this.svg.selectAll("line")
      .filter((linkData: any) => linkData.source === d || linkData.target === d)
      .attr("stroke", this.linkStroke);
  }

  private center(): void {
    this.svg.transition().duration(this.resizeTransitionDuration).call(this.zoomHandler.transform, d3.zoomIdentity);
    this.simulation.force("center", d3.forceCenter(this.width / 2, this.height / 2)).restart();
  }

  private calculateNodeRadius(node: any): number {
    const connectedLinks = this.linkedLinksMap.get(node) || [];
    return this.nodeRadiusNormal + connectedLinks.length * this.radiusImportanceRadius;
  }

  private resetNodeOpacity(): void {
    // Imposta l'opacità di tutti i nodi a 1
    this.svg.selectAll("circle")
      .transition()
      .duration(this.resizeForceCenterDuration)
      .style("opacity", 1);

    // Imposta l'opacità di tutti i link a 1
    this.svg.selectAll("line")
      .transition()
      .duration(this.resizeForceCenterDuration)
      .style("opacity", 1);
  }

}
