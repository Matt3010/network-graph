<?php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [
        's3' => [
            'driver' => 's3',
            'key' => 'M8D2bqvdjy6TMkzt1Rrq',
            'secret' => 'NwJH38AQGpth2rIrsQLjOgvVxXkhdd1WIfQLTidj',
            'region' => 'us-east-1',
            'bucket' => 'network-storage',
            'endpoint' => 'http://localhost:9000',
            'use_path_style_endpoint' => true,
        ],
    ],
];
