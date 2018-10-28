<?php

    function quicksort(array $array) {
        if (count($array) < 2)
            return $array;

        $pivot = $array[0];
        $middle = $left = $right = [];

        for ($i = 0; $i < count($array); $i++) {
            if ($array[$i] < $pivot)
                array_push($left, $array[$i]);
            elseif ($array[$i] == $pivot)
                array_push($middle, $array[$i]);
            else
                array_push($right, $array[$i]);
        }
        return array_merge(quicksort($left), $middle, quicksort($right));
    }

    echo "Quicksort Average Case: ".json_encode(quicksort([9,321,453,15,2,456,25,3,31,84,852,
        6,951,75,724,854,156,846,591,1,4,13,-1,61,123,18,7,7]));
    echo "\n";

    echo "Quicksort Worst Case: ".json_encode(quicksort([951,854,852,846,724,591,456,453,321,
        156,123,84,75,61,31,25,18,15,13,9,7,7,6,4,3,2,1,-1]));
    echo "\n";

?>
