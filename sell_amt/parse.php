<?php
$fh = fopen(__DIR__ . '/villages.csv', 'r');
fgetcsv($fh, 2048);
$villages = array();
while($line = fgetcsv($fh, 2048)) {
  $villages[$line[4].$line[3].$line[2]] = $line[1];
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

  $key = $line[1].$line[2].$line[3];
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
    $key = '桃園市大溪區興合里';
    break;
  }
  if(!isset($villages[$key])) {
    $line[2] = strtr($line[2], $dict2);
    $line[3] = strtr($line[3], $dict3);
    $key = $line[1].$line[2].$line[3];
    if(!isset($villages[$key])) {
      echo implode(',', array(
        $line[3], $line[2], $line[1]
      ));
      echo "\n{$key}\n";
    }
  }
}
