<?php

/*
  Array
  (
  [0] => Ym
  [1] => code1
  [2] => gen
  [3] => cunli code
  [4] => cunli
  [5] => area code
  [6] => area
  [7] => city code
  [8] => city
  )
 */
$result = array();
foreach (glob(__DIR__ . '/raw/*.csv') AS $csvFile) {
    $fh = fopen($csvFile, 'r');
    fgetcsv($fh, 2048);
    while ($line = fgetcsv($fh, 2048)) {
        if (!isset($result[$line[1]])) {
            $result[$line[1]] = array();
        }
        $result[$line[1]][$line[0]] = floatval($line[2]);
    }
}
file_put_contents(__DIR__ . '/power.json', json_encode($result));
