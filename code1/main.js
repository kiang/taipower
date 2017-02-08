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
            color: 'rgba(255,255,255,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.3)'
        })
    }),
    b: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(50,255,0,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(50,255,0,0.3)'
        })
    }),
    c: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255,255,0,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,255,0,0.3)'
        })
    }),
    d: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255,200,0,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,200,0,0.3)'
        })
    }),
    e: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255,0,0,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.3)'
        })
    }),
    f: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255,220,0,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,220,0,0.3)'
        })
    }),
    g: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(81,255,0,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(81,255,0,0.3)'
        })
    }),
    h: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0,0,0,0.6)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0,0,0,0.3)'
        })
    })
};
var targetLayer, dataPower, selectedCounty, code2name = {};
$.getJSON('2016.json', {}, function (d) {
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
var popup = new ol.Overlay.Popup();

/*
 * layer
 * EMAP2: 臺灣通用電子地圖透明
 * EMAP6: 臺灣通用電子地圖(不含等高線)
 * EMAP7: 臺灣通用電子地圖EN(透明)
 * EMAP8: Taiwan e-Map
 * PHOTO2: 臺灣通用正射影像
 * ROAD: 主要路網
 */
var baseLayer = new ol.layer.Tile({
    source: new ol.source.WMTS({
        matrixSet: 'EPSG:3857',
        format: 'image/png',
        url: 'http://maps.nlsc.gov.tw/S_Maps/wmts',
        layer: 'EMAP6',
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: true,
        attributions: '<a href="http://maps.nlsc.gov.tw/" target="_blank">國土測繪圖資服務雲</a>'
    }),
    opacity: 0.8
});

var mapLayers = [baseLayer, new ol.layer.Tile({
        source: new ol.source.WMTS({
            matrixSet: 'EPSG:3857',
            format: 'image/png',
            url: 'http://maps.nlsc.gov.tw/S_Maps/wmts',
            layer: 'ROAD',
            tileGrid: new ol.tilegrid.WMTS({
                origin: ol.extent.getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds
            }),
            style: 'default',
            wrapX: true
        }),
        opacity: 0.3
    })];
var cityLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'topo/city.topo.json',
        format: new ol.format.TopoJSON()
    }),
    style: layerStyle
});
cityLayer.on('change', function () {
    if (cityLayer.getSource().getState() === 'ready') {
        cityLayer.getSource().forEachFeature(function (ff) {
            var p = ff.getProperties();
            if (!code2name[p.COUNTYCODE]) {
                code2name[p.COUNTYCODE] = p.COUNTYNAME;
            }
            if (!code2name[p.TOWNCODE]) {
                code2name[p.TOWNCODE] = p.TOWNNAME;
            }
        });
    }
})
mapLayers.push(cityLayer);
var map = new ol.Map({
    layers: mapLayers,
    target: 'map',
    controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        })
    }),
    view: new ol.View({
        center: ol.proj.fromLonLat([121, 24]),
        zoom: 10
    })
});
map.addOverlay(popup);
map.on('singleclick', onLayerClick);
map.on('pointermove', onPointerMove);

function onPointerMove(e) {
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        var p = feature.getProperties();
        if (p.COUNTYCODE) {
            $('.navbar-text').html(p.COUNTYNAME + ' > ' + p.TOWNNAME);
        } else if (p.CODE1) {
            $('.navbar-text').html(code2name[p.COUNTY_ID] + ' > ' + code2name[p.TOWN_ID] + ' > ' + p.CODE1);
        }
    });
}
;

function onLayerClick(e) {
    var hasFeature = false;
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        var p = feature.getProperties();
        if (p.COUNTYCODE) {
            $('.navbar-text').html(p.COUNTYNAME + ' > ' + p.TOWNNAME);
            targetLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: 'topo/' + p.COUNTYCODE + '.json',
                    format: new ol.format.TopoJSON()
                }),
                style: layerStyle
            });
            targetLayer.once('change', function () {
                if (targetLayer.getSource().getState() === 'ready') {
                    fillTargetColor();
                }
            });
            map.addLayer(targetLayer);
            cityLayer.setVisible(false);
            map.getView().setCenter(e.coordinate);
            map.getView().setZoom(12);
        } else {
            $('.navbar-text').html(code2name[p.COUNTY_ID] + ' > ' + code2name[p.TOWN_ID] + ' > ' + p.CODE1);
            var message = '';
            if (dataPower[p.CODE1] && dataPower[p.CODE1].total > 0) {
                message += '<table class="table table-bordered"><thead><tr><td>月份</td><td>用電量(度)</td></tr></thead><tbody>';
                for (ym in dataPower[p.CODE1]) {
                    if (ym !== 'total') {
                        message += '<tr><td>' + ym + '</td><td>' + dataPower[p.CODE1][ym] + '</td></tr>';
                    }
                }
                message += '</tbody></table>';
            }
            if (message !== '') {
                popup.show(e.coordinate, message);
            }
            map.getView().setCenter(e.coordinate);
            map.getView().setZoom(14);
        }
        hasFeature = true;
    });
    if (false === hasFeature) {
        cityLayer.setVisible(true);
        map.getView().setZoom(12);
        targetLayer.setVisible(false);
        popup.hide();
    }
}

function ColorBar(value) {
    if (value == 0)
        return colorPool.a;
    else if (value <= 50000)
        return colorPool.b
    else if (value <= 100000)
        return colorPool.c
    else if (value <= 200000)
        return colorPool.d
    else if (value <= 300000)
        return colorPool.e
    else if (value <= 500000)
        return colorPool.f
    else if (value <= 1000000)
        return colorPool.g
    else
        return colorPool.h
}

function fillTargetColor() {
    targetLayer.getSource().forEachFeature(function (ff) {
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