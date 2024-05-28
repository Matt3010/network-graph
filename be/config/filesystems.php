<?php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [
        's3' => [
            'driver' => 's3',
            'key' => 'ZLHOwxxB3xr1Jjmiea9F',
            'secret' => 'tvcGrr4pjzIR0iOIn4oYtFYRuvGdDsLpyfXVrq11',
            'region' => 'us-east-1', // Cambia la regione se necessario
            'bucket' => 'network-storage',
            'endpoint' => 'minio', // Indirizzo di MinIO
            'use_path_style_endpoint' => true, // Necessario per l'endpoint locale
        ],
    ],

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
