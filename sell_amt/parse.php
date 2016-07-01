<?php
$fh = fopen(__DIR__ . '/villages.csv', 'r');
fgetcsv($fh, 2048);
$villages = $villageLines = array();
while($line = fgetcsv($fh, 2048)) {
  $villages[$line[4].$line[3].$line[2]] = $line[1];
  $villageLines[$line[1]] = $line;
}
$fh = fopen(__DIR__ . '/open_sell_amt_vil.csv', 'r');
fgetcsv($fh, 2048);
/*
Array
(
    [0] => ﻿日期
    [1] => 縣市
    [2] => 鄉鎮市區
    [3] => 村里
    [4] => 售電量
)
*/
$dict2 = array(' ' => '', '　' => '');
$dict3 = array('館' => '舘', '濂' => '濓', ' ' => '', '　' => '',
'腳' => '脚', '猐' => '獇', '汴州' => '汴洲', '売' => '壳', '鹽' => '塩', '那拔' => '𦰡拔',
'雞' => '鷄', '豊' => '豐', '廈' => '厦', '涼' => '凉');
$pool = $dateKeys = array();
while($line = fgetcsv($fh, 2048)) {
  foreach($line AS $k => $v) {
    $line[$k] = trim($v);
  }
  if($line[3] === '無法分類' || in_array(substr($line[3], -3), array('路'))) {
    continue;
  }
  if($line[1] === '桃園市' && substr($line[3], -3) !== '里') {
    $line[3] = substr($line[3], 0, -3) . '里';
  }

  $line[0] = preg_replace('/[^0-9]/i', '', $line[0]);
  if(!isset($dateKeys[$line[0]])) {
    $dateKeys[$line[0]] = true;
  }

  $key = $line[1].$line[2].$line[3];
  $key = str_replace(array_keys($dict2), '', $key);
  switch($key) {
    case '桃園市中壢區南興里':
    $key = '桃園市大溪區南興里';
    break;
    case '桃園市龍潭區仁安里':
    $key = '新竹縣關西鎮仁安里';
    break;
    case '桃園市龍潭區東安里':
    $key = '新竹縣關西鎮東安里';
    break;
    case '桃園市龍潭區大坪里':
    case '桃園市龍潭區太平里':
    $key = '桃園市龍潭區大平里';
    break;
    case '桃園市龍潭區東勢里':
    $key = '桃園市平鎮區東勢里';
    break;
    case '桃園市蘆竹區大華里':
    $key = '桃園市龜山區大華里';
    break;
    case '高雄市左營區復興里':
    $key = '高雄市左營區永清里';
    break;
    case '宜蘭縣宜蘭市大東里':
    $key = '宜蘭縣宜蘭市小東里';
    break;
    case '宜蘭縣宜蘭市大道里':
    $key = '宜蘭縣宜蘭市南門里';
    break;
    case '宜蘭縣宜蘭市中正里':
    $key = '宜蘭縣宜蘭市東門里';
    break;
    case '宜蘭縣宜蘭市民生里':
    case '宜蘭縣宜蘭市昇平里':
    $key = '宜蘭縣宜蘭市新民里';
    break;
    case '宜蘭縣宜蘭市和睦里':
    $key = '宜蘭縣宜蘭市神農里';
    break;
    case '宜蘭縣宜蘭市鄂王里':
    $key = '宜蘭縣宜蘭市西門里';
    break;
    case '宜蘭縣宜蘭市新興里':
    $key = '宜蘭縣宜蘭市大新里';
    break;
    case '宜蘭縣宜蘭市慶和里':
    $key = '宜蘭縣宜蘭市北門里';
    break;
    case '宜蘭縣蘇澳鎮岳明里':
    $key = '宜蘭縣蘇澳鎮港邊里';
    break;
    case '彰化縣埔鹽鄉瓦廍村':
    case '彰化縣埔鹽鄉瓦?村':
    $key = '彰化縣埔鹽鄉瓦磘村';
    break;
    case '雲林縣水林鄉瓊埔村':
    $key = '雲林縣水林鄉𣐤埔村';
    break;
    case '新竹市東區高峯里':
    $key = '新竹市東區高峰里';
    break;
    case '金門縣金寧鄉賢庵里':
    $key = '金門縣金城鎮賢庵里';
    break;
    case '新北市新店區五峰里':
    $key = '新北市新店區五峯里';
    break;
    case '新北市坪林區石曹里':
    $key = '新北市坪林區石𥕢里';
    break;
    case '高雄市鳳山區海風里':
    $key = '高雄市鳳山區海光里';
    break;
    case '高雄市鳳山區誠正里':
    $key = '高雄市鳳山區生明里';
    break;
    case '桃園市八德區竹圍里':
    $key = '桃園市八德區竹園里';
    break;
    case '桃園市八德區高明里里':
    $key = '桃園市八德區高明里';
    break;
    case '桃園市大溪區人文里':
    $key = '桃園市大溪區仁文里';
    break;
    case '桃園市中壢區中福里':
    $key = '桃園市中壢區忠福里';
    break;
    case '桃園市中壢區後興里':
    $key = '桃園市中壢區復興里';
    break;
    case '桃園市中壢區興合里':
    $key = '桃園市大溪區興和里';
    break;
    case '桃園市平鎮區振興里':
    $key = '桃園市中壢區振興里';
    break;
    case '新北市中和區瓦?里':
    $key = '新北市中和區瓦磘里';
    break;
    case '新北市中和區灰?里':
    $key = '新北市中和區灰磘里';
    break;
    case '新北市永和區新?里':
    $key = '新北市永和區新廍里';
    break;
    case '新北市瑞芳區爪?里':
    $key = '新北市瑞芳區爪峯里';
    break;
    case '臺北市萬華區糖?里':
    $key = '臺北市萬華區糖廍里';
    break;
    case '臺中市大安區龜?里':
    $key = '臺中市大安區龜壳里';
    break;
    case '臺中市大肚區蔗?里':
    $key = '臺中市大肚區蔗廍里';
    break;
    case '臺南市山上區玉?里':
    $key = '臺南市山上區玉峯里';
    break;
    case '臺南市佳里區頂?里':
    $key = '臺南市佳里區頂廍里';
    break;
    case '臺南市官田區南?里':
    $key = '臺南市官田區南廍里';
    break;
    case '臺南市麻豆區寮?里':
    $key = '臺南市麻豆區寮廍里';
    break;
    case '彰化縣芳苑鄉頂?村':
    $key = '彰化縣芳苑鄉頂廍村';
    break;
    case '桃園市平鎮區舊明里':
    $key = '桃園市中壢區舊明里';
    break;
    case '桃園市桃園區大竹里':
    $key = '桃園市蘆竹區大竹里';
    break;
    case '桃園市桃園區中杉里':
    $key = '桃園市桃園區中山里';
    break;
    case '桃園市桃園區清溪里':
    $key = '桃園市桃園區青溪里';
    break;
    case '桃園市桃園區楓樹里':
    $key = '桃園市龜山區楓樹里';
    break;
    case '桃園市桃園區廣龍里':
    $key = '桃園市八德區廣隆里';
    break;
    case '桃園市龜山區免坑里':
    $key = '桃園市龜山區兔坑里';
    break;
    case '桃園市龜山區坑口里':
    $key = '桃園市蘆竹區坑口里';
    break;
    case '金門縣金城鎮光前里':
    $key = '金門縣金沙鎮光前里';
    break;
    case '金門縣金寧鄉瓊林里':
    $key = '金門縣金湖鎮瓊林里';
    break;
    case '彰化縣員林鎮大?里':
    $key = '彰化縣員林鎮大峯里';
    break;
    case '彰化縣彰化市下?里':
    $key = '彰化縣彰化市下廍里';
    break;
    case '彰化縣彰化市磚?里':
    $key = '彰化縣彰化市磚磘里';
    break;
    case '雲林縣元長鄉瓦?村':
    $key = '雲林縣元長鄉瓦磘村';
    break;
    case '雲林縣斗六市崙?里':
    $key = '雲林縣斗六市崙峯里';
    break;
    case '雲林縣麥寮鄉瓦?村':
    $key = '雲林縣麥寮鄉瓦磘村';
    break;
    case '嘉義縣梅山鄉瑞?村':
    $key = '嘉義縣梅山鄉瑞峯村';
    break;
    case '屏東縣東港鎮下?里':
    $key = '屏東縣東港鎮下廍里';
    break;
    case '屏東縣新園鄉瓦?村':
    $key = '屏東縣新園鄉瓦磘村';
    break;
    case '臺東縣達仁鄉土?村':
    $key = '臺東縣達仁鄉土坂村';
    break;
    case '臺東縣關山鎮里?里':
    $key = '臺東縣關山鎮里壠里';
    break;
    case '嘉義市西區磚?里':
    $key = '嘉義市西區磚磘里';
    break;
    case '新竹縣北埔鄉水?村':
    $key = '新竹縣北埔鄉水磜村';
    break;
    case '彰化縣彰化市寶?里':
    $key = '彰化縣彰化市寶廍里';
    break;
    case '屏東縣里港鄉三?村':
    $key = '屏東縣里港鄉三廍村';
    break;
    case '屏東縣林邊鄉崎?村':
    $key = '屏東縣林邊鄉崎峯村';
    break;
    case '臺東縣達仁鄉台?村':
    $key = '臺東縣達仁鄉台坂村';
    break;
    case '金門縣烈嶼鄉上歧村':
    $key = '金門縣烈嶼鄉上岐村';
    break;
  }
  if(!isset($villages[$key])) {
    $line[2] = strtr($line[2], $dict2);
    $line[3] = strtr($line[3], $dict3);
    $key = $line[1].$line[2].$line[3];
    // if(!isset($villages[$key])) {
    //   echo implode(',', array(
    //     $line[3], $line[2], $line[1]
    //   ));
    //   echo "\n{$key}\n";
    // }
  }
  if(isset($villages[$key])) {
    if(!isset($pool[$villages[$key]])) {
      $pool[$villages[$key]] = array();
    }
    if(isset($pool[$villages[$key]][$line[0]])) {
      $pool[$villages[$key]][$line[0]] += $line[4];
    } else {
      $pool[$villages[$key]][$line[0]] = $line[4];
    }
  }
}

$fh = fopen(__DIR__ . '/records.csv', 'w');
fputcsv($fh, array_merge(array('code', 'village', 'area', 'city'), array_keys($dateKeys)));
foreach($pool AS $key => $val) {
  $line = array(
    $key, $villageLines[$key][2], $villageLines[$key][3], $villageLines[$key][4]
  );
  foreach($dateKeys AS $k => $v) {
    if(isset($val[$k])) {
      $line[] = $val[$k];
    } else {
      $line[] = 0;
    }
  }
  fputcsv($fh, $line);
}
