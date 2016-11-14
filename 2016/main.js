$.ajaxSetup({async: false});
var loadedCity = {}, currentCity = '', power = {};
var map, area, currentButton = 'playButton3', headers;

$.getJSON('power.json', function (d) {
    power = d;
});

var showCity = function (city) {
    $('.modal').dialog({
        title: "資料載入中",
        modal: true,
        width: 300,
        height: 200,
        closeOnEscape: false,
        resizable: false,
        open: function () {
            $(".ui-dialog-titlebar-close", $(this).parent()).hide(); //hides the little 'x' button
        }
    });
    $('body').addClass("loading");
    currentCity = city;
    $('.mapCity').each(function (k, e) {
        var eCity = $(e).html();
        if (eCity === currentCity) {
            $(e).removeClass('btn-default').addClass('btn-primary');
        } else {
            $(e).removeClass('btn-primary').addClass('btn-default');
        }
    });
    if (!loadedCity[currentCity]) {
        $.getJSON('json/' + currentCity + '.json', function (data) {
            loadedCity[currentCity] = data;
        });
    }
    map.data.forEach(function (l) {
        map.data.remove(l);
    });
    area = map.data.addGeoJson(loadedCity[currentCity]);
    showArea(currentButton);
    switch (city) {
        case '台北市':
            map.setCenter({lat: 25.053699, lng: 121.507837});
            break;
        case '新北市':
            map.setCenter({lat: 25.053699, lng: 121.507837});
            break;
        case '桃園市':
            map.setCenter({lat: 24.9656572, lng: 121.222804});
            break;
        case '台中市':
            map.setCenter({lat: 24.167804, lng: 120.658214});
            break;
        case '台南市':
            map.setCenter({lat: 22.996169, lng: 120.201330});
            break;
        case '高雄市':
            map.setCenter({lat: 22.643894, lng: 120.317828});
            break;
        case '宜蘭縣':
            map.setCenter({lat: 24.677393, lng: 121.767628});
            break;
        case '新竹縣':
            map.setCenter({lat: 24.726808, lng: 121.109712});
            break;
        case '苗栗縣':
            map.setCenter({lat: 24.532913, lng: 120.836947});
            break;
        case '彰化縣':
            map.setCenter({lat: 24.009515, lng: 120.502431});
            break;
        case '南投縣':
            map.setCenter({lat: 23.939787, lng: 120.968750});
            break;
        case '雲林縣':
            map.setCenter({lat: 23.693670, lng: 120.438016});
            break;
        case '嘉義縣':
            map.setCenter({lat: 23.464988, lng: 120.327423});
            break;
        case '屏東縣':
            map.setCenter({lat: 22.598342, lng: 120.540550});
            break;
        case '台東縣':
            map.setCenter({lat: 22.766960, lng: 121.082108});
            break;
        case '花蓮縣':
            map.setCenter({lat: 23.700363, lng: 121.458446});
            break;
        case '基隆市':
            map.setCenter({lat: 25.124337, lng: 121.735592});
            break;
        case '新竹市':
            map.setCenter({lat: 24.797534, lng: 120.968834});
            break;
        case '嘉義市':
            map.setCenter({lat: 23.479583, lng: 120.454789});
            break;
    }
    setTimeout(function () {
        $('body').removeClass("loading");
        $('.modal').dialog('close');
    }, 500);
}

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
        var key = value.getProperty('CODE1'),
                count = 0;
        if (power[key]) {
            switch (currentButton) {
                case 'playButton1':
                    if (power[key]['10501']) {
                        count += parseInt(power[key]['10501']);
                    }
                    if (power[key]['10502']) {
                        count += parseInt(power[key]['10502']);
                    }
                    break;
                case 'playButton2':
                    if (power[key]['10503']) {
                        count += parseInt(power[key]['10503']);
                    }
                    if (power[key]['10504']) {
                        count += parseInt(power[key]['10504']);
                    }
                    break;
                case 'playButton3':
                    if (power[key]['10505']) {
                        count += parseInt(power[key]['10505']);
                    }
                    if (power[key]['10506']) {
                        count += parseInt(power[key]['10506']);
                    }
                    break;
            }
        }
        if (isNaN(count)) {
            count = 0;
        } else {
            count = Math.round(count / 1000);
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
    var area = feature.getProperty('TOWN') + '[' + feature.getProperty('CODE1') + ']';
    var areaKey = feature.getProperty('CODE1');
    var detail = '<h3>' + area + '</h3><div style="float:right;">單位：(千度)</div><table class="table table-boarded">';
    var targetHash = '#' + currentButton + '/' + areaKey;
    if (loadedCity[currentCity]['data'][areaKey]) {
        for (m in loadedCity[currentCity]['data'][areaKey]) {
            detail += '<tr><td colspan="2">' + m + '</td></tr>';
            detail += '<tr>';
            for (k in headers) {
                if (loadedCity[currentCity]['data'][areaKey][m][k] === 'NULL') {
                    loadedCity[currentCity]['data'][areaKey][m][k] = '';
                }
                detail += '<td>' + headers[k] + '</td><td>' + loadedCity[currentCity]['data'][areaKey][m][k] + '</td></tr>';
            }
            detail += '</tr>';
        }
    }
    detail += '</table>';
    $('#areaDetail').html(detail);
    if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
    }
}

var routes = {
    '/:theButton/:areaCode': showArea,
    '/:theButton': showArea
};
var router = Router(routes);

function initialize() {
    /*map setting*/
    $('#map-canvas').height(window.outerHeight / 2.2);

    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 11,
        center: {lat: 25.053699, lng: 121.507837}
    });

    showCity('台北市');
    router.init();

    $('.mapCity').click(function () {
        showCity($(this).html());
        return false;
    });

    map.data.addListener('mouseover', function (event) {
        var Area = event.feature.getProperty('TOWN') + '[' + event.feature.getProperty('CODE1') + ']';
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
        $('html,body').scrollTop(0);
        return false;
    });

    $('#playButton2').on('click', function () {
        currentButton = 'playButton2';
        window.location.hash = '#' + currentButton;
        $('html,body').scrollTop(0);
        return false;
    });

    $('#playButton3').on('click', function () {
        currentButton = 'playButton3';
        window.location.hash = '#' + currentButton;
        $('html,body').scrollTop(0);
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
    else if (value <= 100)
        return "#FFFF66"
    else if (value <= 200)
        return "#FFFF00"
    else if (value <= 300)
        return "#FFBF00"
    else if (value <= 400)
        return "#FF9F00"
    else if (value <= 500)
        return "#FF3F00"
    else if (value <= 600)
        return "#FF0000"
    else
        return "#CC0000"
}
