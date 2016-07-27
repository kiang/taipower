$.ajaxSetup({async: false});

var showArea = function (theButton, areaCode) {
    if (!areaCode) {
        areaCode = '';
    }
    currentButton = theButton;
    $('a.btn-year').each(function () {
        if ($(this).attr('id') === currentButton) {
            $(this).removeClass('btn-default').addClass('btn-primary');
        } else {
            $(this).removeClass('btn-primary').addClass('btn-default');
        }
    });
    $('.btn-primary').removeClass('active disabled').find('.glyphicon').hide();
    $('#' + currentButton).addClass('active disabled').find('.glyphicon').show();
    area.forEach(function (value) {
        var key = value.getProperty('CODE3'),
                count = 0;
        if (areaPower[key]) {
            switch (theButton) {
                case 'playButton1':
                    count = Math.round((parseInt(areaPower[key][5]) + parseInt(areaPower[key][6])) / 1000);
                    break;
                case 'playButton2':
                    count = Math.round((parseInt(areaPower[key][7]) + parseInt(areaPower[key][8])) / 1000);
                    break;
                case 'playButton3':
                    count = Math.round((parseInt(areaPower[key][9]) + parseInt(areaPower[key][10])) / 1000);
                    break;
                case 'playButton4':
                    count = Math.round((parseInt(areaPower[key][11]) + parseInt(areaPower[key][12])) / 1000);
                    break;
            }
        }
        value.setProperty('num', count);
        if (areaCode === key) {
            showFeature(value);
        }
    });

    map.data.setStyle(function (feature) {
        color = ColorBar(feature.getProperty('num'));
        return {
            fillColor: color,
            fillOpacity: 0.6,
            strokeWeight: 0
        }
    });
};

function showFeature(feature) {
    var area = feature.getProperty('COUN_NA') + feature.getProperty('TOWN_NA') + '[' + feature.getProperty('CODE3') + ']';
    var areaKey = feature.getProperty('CODE3');
    var detail = '<h3>' + area + '</h3><div style="float:right;">單位：(千度)</div><table class="table table-boarded">';
    var targetHash = '#' + currentButton + '/' + areaKey;
    var foundFeatureGeo = feature.getGeometry().getAt(0).getArray();
    if (areaPower[areaKey]) {
        detail += '<tr>';
        for (k in headers) {
            if(areaPower[areaKey][k] === 'NULL') {
                areaPower[areaKey][k] = '';
            }
            detail += '<td>' + headers[k] + '</td><td>' + areaPower[areaKey][k] + '</td></tr>';
        }
        detail += '</tr>';
    }
    detail += '</table>';
    $('#areaDetail').html(detail);
    if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
    }
    var bounds = new google.maps.LatLngBounds;
    for (k in foundFeatureGeo) {
        bounds.extend(foundFeatureGeo[k]);
    }
    map.fitBounds(bounds);
}

var routes = {
    '/:theButton/:areaCode': showArea,
    '/:theButton': showArea
};
var router = Router(routes);

var map, area, areaPower = {}, currentButton = 'playButton4', headers;

$.get('egis/102_PowerSum.csv', {}, function (p) {
    var stack = $.csv.toArrays(p);
    headers = stack.shift();
    for (k in stack) {
        areaPower[stack[k][4]] = stack[k];
    }
});
function initialize() {
    /*map setting*/
    $('#map-canvas').height(window.outerHeight / 2.2);

    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 11,
        center: {lat: 23.00, lng: 120.30}
    });

    $.getJSON('egis/code3.json', function (data) {
        area = map.data.addGeoJson(topojson.feature(data, data.objects.code3_o));
    });
    router.init();

    map.data.addListener('mouseover', function (event) {
        var Area = event.feature.getProperty('COUN_NA') + event.feature.getProperty('TOWN_NA') + '[' + event.feature.getProperty('CODE3') + ']';
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {fillColor: 'white'});
        $('#content').html('<div>' + Area + ' ：' + event.feature.getProperty('num') + ' </div>').removeClass('text-muted');
    });

    map.data.addListener('click', function (event) {
        showFeature(event.feature);
    });

    map.data.addListener('mouseout', function (event) {
        map.data.revertStyle();
        $('#content').html('在地圖上滑動或點選以顯示數據').addClass('text-muted');
    });

    $('#playButton1').on('click', function () {
        currentButton = 'playButton1';
        window.location.hash = '#' + currentButton;
        return false;
    });

    $('#playButton2').on('click', function () {
        currentButton = 'playButton2';
        window.location.hash = '#' + currentButton;
        return false;
    });

    $('#playButton3').on('click', function () {
        currentButton = 'playButton3';
        window.location.hash = '#' + currentButton;
        return false;
    });

    $('#playButton4').on('click', function () {
        currentButton = 'playButton4';
        window.location.hash = '#' + currentButton;
        return false;
    });

    if (window.location.hash == '' || window.location.hash == '#') {
        window.location.hash = '#' + currentButton;
    }
}

google.maps.event.addDomListener(window, 'load', initialize);

function ColorBar(value) {
    if (value == 0)
        return "#FFFFFF"
    else if (value <= 500)
        return "#FFFF99"
    else if (value <= 1000)
        return "#FFFF66"
    else if (value <= 1500)
        return "#FFFF33"
    else if (value <= 2000)
        return "#FFFF00"
    else if (value <= 2500)
        return "#CCCC00"
    else if (value <= 3000)
        return "#999900"
    else
        return "#666600"
}
