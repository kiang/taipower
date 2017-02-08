<?php

$result = array();
foreach (glob(__DIR__ . '/raw/*.csv') AS $csvFile) {
    $fh = fopen($csvFile, 'r');
    fgetcsv($fh, 2048);
    /*
     * Array
      (
      [0] => 10501
      [1] => A0804-10-001
      [2] => 1617.0
      [3] => 008
      [4] => 中和里
      [5] => 10008040
      [6] => 竹山鎮
      [7] => 10008
      [8] => 南投縣
      )
     */
    while ($line = fgetcsv($fh, 2048)) {
        $line[2] = intval($line[2]);
        if (!isset($result[$line[1]])) {
            $result[$line[1]] = array(
                'total' => 0,
            );
        }
        $result[$line[1]][$line[0]] = $line[2];
        $result[$line[1]]['total'] += $line[2];
    }
}

file_put_contents(__DIR__ . '/2016.json', json_encode($result));
