<?php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [
        's3' => [
            'driver' => 's3',
            'key' => 'JVlQEYtEKujvmf6IUhj7',
            'secret' => 'A9MX2RBXnwlf3k6pncuS2dYazmiButvnGPwPG9or',
            'region' => 'us-east-1', // Cambia la regione se necessario
            'bucket' => 'dev-network-app',
            'endpoint' => 'http://localhost:9000', // Indirizzo di MinIO
            'use_path_style_endpoint' => true, // Necessario per l'endpoint locale
        ],
    ],

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
