var layerStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'rgba(0,255,255,0.6)',
        width: 2
    }),
    fill: new ol.style.Fill({
        color: 'rgba(0,200,200,0.1)'
    })
});
var colorPool = {
    a: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255,255,178,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,255,178,0.7)'
        })
    }),
    b: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(254,217,118,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(254,217,118,0.7)'
        })
    }),
    c: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(254,178,76,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(254,178,76,0.7)'
        })
    }),
    d: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(253,141,60,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(253,141,60,0.7)'
        })
    }),
    e: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(252,78,42,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(252,78,42,0.7)'
        })
    }),
    f: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(227,26,28,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(227,26,28,0.7)'
        })
    }),
    g: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(177,0,38,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(177,0,38,0.7)'
        })
    }),
    h: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(107,0,23,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(107,0,23,0.7)'
        })
    })
};
var targetLayer1, targetLayer2, dataPower, selectedCounty, code2name = {};
$.getJSON('../2016.json', {}, function (d) {
    dataPower = d;
});

var projection = ol.proj.get('EPSG:3857');
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = new Array(20);
var matrixIds = new Array(20);
for (var z = 0; z < 20; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = z;
}

var map = new ol.Map({
    layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
    target: 'map',
    controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        })
    }),
    view: new ol.View({
        center: ol.proj.fromLonLat([121.6, 25.03]),
        zoom: 11
    })
});

targetLayer1 = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: '../topo/63000.json',
        format: new ol.format.TopoJSON()
    }),
    style: layerStyle
});
targetLayer1.once('change', function () {
    if (targetLayer1.getSource().getState() === 'ready') {
        fillTargetColor(targetLayer1);
    }
});
map.addLayer(targetLayer1);
targetLayer2 = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: '../topo/65000.json',
        format: new ol.format.TopoJSON()
    }),
    style: layerStyle
});
targetLayer2.once('change', function () {
  if (targetLayer2.getSource().getState() === 'ready') {
      fillTargetColor(targetLayer2);
  }
});
map.addLayer(targetLayer2);

var canvas = $('canvas').get(0);

document.getElementById('export-png').addEventListener('click', function() {
  map.once('precompose', function(event) {
			setDPI(canvas, 150);
	});
  map.once('postcompose', function(event) {
    var canvas = event.context.canvas;
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
    } else {
      canvas.toBlob(function(blob) {
        saveAs(blob, 'map.png');
      });
    }
  });
  map.renderSync();
});

function ColorBar(value) {
    if (value == 0)
      return colorPool.a;
    else if (value <= 435255)
      return colorPool.b;
    else if (value <= 590521)
        return colorPool.c
    else if (value <= 745107)
        return colorPool.d
    else if (value <= 908059)
        return colorPool.e
    else if (value <= 1115873)
        return colorPool.f
    else if (value <= 1456461)
        return colorPool.g
    else
        return colorPool.h
}

function fillTargetColor(tl) {
  tl.getSource().forEachFeature(function (ff) {
      var cp = ff.getProperties();
      var colorDone = false;
      for (k in dataPower) { // k = code1
          if (colorDone === false && k == cp.CODE1) {
              ff.setStyle(ColorBar(dataPower[k].total));
              colorDone = true;
          }
      }
  });
}

function setDPI(canvas, dpi) {
    var scaleFactor = dpi / 96;
    canvas.width = Math.ceil(canvas.width * scaleFactor);
    canvas.height = Math.ceil(canvas.height * scaleFactor);
	var ctx=canvas.getContext("2d");
    ctx.scale(scaleFactor, scaleFactor);
}
