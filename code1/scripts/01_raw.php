<?php
$links = array(
  '106下半年嘉義縣非營業用戶售電量' => 'https://data.gov.tw/dataset/83619',
'106下半年嘉義市非營業用戶售電量' => 'https://data.gov.tw/dataset/83620',
'106下半年台南市非營業用戶售電量' => 'https://data.gov.tw/dataset/83622',
'106下半年高雄市非營業用戶售電量' => 'https://data.gov.tw/dataset/83430',
'106下半年屏東縣非營業用戶售電量' => 'https://data.gov.tw/dataset/83634',
'106下半年南投縣非營業用戶售電量' => 'https://data.gov.tw/dataset/83644',
'106下半年宜蘭縣非營業用戶售電量' => 'https://data.gov.tw/dataset/83650',
'106下半年花蓮縣非營業用戶售電量' => 'https://data.gov.tw/dataset/83704',
'106下半年台東縣非營業用戶售電量' => 'https://data.gov.tw/dataset/83735',
'106下半年基隆市非營業用戶售電量' => 'https://data.gov.tw/dataset/83418',
'106下半年新竹縣非營業用戶售電量' => 'https://data.gov.tw/dataset/83430',
'106下半年新竹市非營業用戶售電量' => 'https://data.gov.tw/dataset/83429',
'106下半年桃園市非營業用戶售電量' => 'https://data.gov.tw/dataset/83427',
'106下半年新北市非營業用戶售電量' => 'https://data.gov.tw/dataset/83426',
'106下半年台北市非營業用戶售電量' => 'https://data.gov.tw/dataset/83422',
'106下半年苗栗縣非營業用戶售電量' => 'https://data.gov.tw/dataset/83431',
'106下半年台中市非營業用戶售電量' => 'https://data.gov.tw/dataset/83432',
'106下半年彰化縣非營業用戶售電量' => 'https://data.gov.tw/dataset/83433',
'106下半年雲林縣非營業用戶售電量' => 'https://data.gov.tw/dataset/83434',
);
$basePath = dirname(__DIR__);

foreach($links AS $fname => $flink) {
  $page = file_get_contents($flink);
  $pos = strpos($page, 'http://data.taipower.com.tw/');
  $posEnd = strpos($page, '.csv', $pos);
  $csvLink = substr($page, $pos, $posEnd - $pos) . '.csv';
  $targetFile = $basePath . '/raw/' . $fname . '.csv';
  file_put_contents($targetFile, file_get_contents($csvLink));
}
