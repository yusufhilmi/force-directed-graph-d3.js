
var nodes = [
    { id: "mammal", group: 0, label: "Mammals", level: 1 },
    { id: "dog"   , group: 0, label: "Dogs"   , level: 2 },
    { id: "cat"   , group: 0, label: "Cats"   , level: 2 },
    { id: "fox"   , group: 0, label: "Foxes"  , level: 2 },
    { id: "elk"   , group: 0, label: "Elk"    , level: 2 },
    { id: "insect", group: 1, label: "Insects", level: 3 },
    { id: "ant"   , group: 1, label: "Ants"   , level: 2 },
    { id: "bee"   , group: 1, label: "Bees"   , level: 2 },
    { id: "fish"  , group: 2, label: "Fish"   , level: 3 },
    { id: "carp"  , group: 2, label: "Carp"   , level: 2 },
    { id: "pike"  , group: 2, label: "Pikes"  , level: 2 },
    { id: "1"     , group: 3, label: "1"      , level: 3 },
    { id: "2"     , group: 3, label: "2"      , level: 4 },
   
    
  ]

  
/*

  require('./nodes.json');
  */
  var links = [
      { target: "mammal", source: "dog" , strength: 0.7 },
      { target: "mammal", source: "cat" , strength: 0.7 },
    { target: "mammal", source: "fox" , strength: 0.7 },
    { target: "mammal", source: "elk" , strength: 0.7 },
    { target: "insect", source: "bee" , strength: 0.7 },
    { target: "fish"  , source: "carp", strength: 0.7 },
    { target: "fish"  , source: "pike", strength: 0.7 },
    { target: "cat"   , source: "elk" , strength: 0.1 },
    { target: "carp"  , source: "ant" , strength: 0.1 },
    { target: "elk"   , source: "bee" , strength: 0.1 },
    { target: "dog"   , source: "cat" , strength: 0.1 },
    { target: "fox"   , source: "ant" , strength: 0.1 },
    { target: "pike"  , source: "cat" , strength: 0.1 },
    { target: "pike"  , source: "carp", strength: 0.1 },
    { target:  "1"    , source: "insect", strength: 0.5},
    { target:  "bee"    , source: "insect", strength: 0.5},
    { target: "1", source: "ant" , strength: 0.7 },
    { target: "1", source: "bee" , strength: 0.7 },
    { target: "1"  , source: "carp", strength: 0.7 },
    { target: "2"  , source: "pike", strength: 0.7 },
    { target: "2"   , source: "elk" , strength: 0.1 },
    { target: "2"  , source: "ant" , strength: 0.1 },
    { target: "2"   , source: "bee" , strength: 0.1 },
    { target: "2"  , source: "carp", strength: 0.1 }
  ];
  
  function getNeighbors(node) {
    return links.reduce(function (neighbors, link) {
        if (link.target.id === node.id) {
          neighbors.push(link.source.id)
        } else if (link.source.id === node.id) {
          neighbors.push(link.target.id)
        }
        return neighbors
      },
      [node.id]
    )
  }
  
  function isNeighborLink(node, link) {
    return link.target.id === node.id || link.source.id === node.id
  }
  
  
  function getNodeColor(node, neighbors) {
    if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
      return node.level === 1 ? '#f3b54a' : 'green'
    }
  
    return node.level === 1 ? 'red' : 'gray'
  }
  
  
  function getLinkColor(node, link) {
    return isNeighborLink(node, link) ? 'green' : '#d8d9de'
  }
  
  function getTextColor(node, neighbors) {
    return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'green' : 'black'
  }
  
  var width = window.innerWidth;
  var height = window.innerHeight;
  
  var svg = d3.select('svg')
  svg.attr('width', width).attr('height', height).style('background-color','#393b45')
        .style('border-style','solid').call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
    }))
  
  // simulation setup with all forces
  var linkForce = d3
    .forceLink()
    .id(function (link) { return link.id })
    .strength(function (link) { return link.strength })
  
  var simulation = d3
    .forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
  
  var dragDrop = d3.drag().on('start', function (node) {
    node.fx = node.x
    node.fy = node.y
  }).on('drag', function (node) {
    simulation.alphaTarget(0.7).restart()
    node.fx = d3.event.x
    node.fy = d3.event.y
  }).on('end', function (node) {
    if (!d3.event.active) {
      simulation.alphaTarget(0)
    }
    node.fx = null
    node.fy = null
  })
  
  function selectNode(selectedNode) {
    var neighbors = getNeighbors(selectedNode)
  
    // we modify the styles to highlight selected nodes
    nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors) })
    textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
    linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
  }
  
  var linkElements = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke-width", 0.6)
      .attr("stroke", "#d8d9de")
      
  
  var nodeElements = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", 8)
      .attr("fill", getNodeColor)
      .call(dragDrop)
      .on('click', selectNode)
      .style('opacity', 0.5)
      .style('stroke' , 'white')
  
  var textElements = svg.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
      .text(function (node) { return  node.label })
        .attr("font-size", 15)
      .attr("font-family", "courier")
        .attr("dx", 15)
      .attr("dy", 4)
  
  simulation.nodes(nodes).on('tick', () => {
    nodeElements
      .attr('cx', function (node) { return node.x })
      .attr('cy', function (node) { return node.y })
    textElements
      .attr('x', function (node) { return node.x })
      .attr('y', function (node) { return node.y })
    linkElements
      .attr('x1', function (link) { return link.source.x })
      .attr('y1', function (link) { return link.source.y })
      .attr('x2', function (link) { return link.target.x })
      .attr('y2', function (link) { return link.target.y })
  })
  
  simulation.force("link").links(links)