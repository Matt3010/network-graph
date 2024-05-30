<?php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [
        's3' => [
            'driver' => 's3',
            'key' => 'CUbTjDvMU6S5BmnRuG5T',
            'secret' => 'qKFKViTkUNcdx7qjOVX0OM5o4IR5t5BVCoa0jYRD',
            'region' => 'us-east-1',
            'bucket' => 'network-storage',
            'endpoint' => 'http://localhost:9000',
            'use_path_style_endpoint' => true,
        ],
    ],
];
