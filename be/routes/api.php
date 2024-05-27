<?php

use App\Http\Controllers\ApiTokenController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\NavigationController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [ApiTokenController::class, 'login']);
    Route::post('/register', [ApiTokenController::class, 'register']);
    Route::middleware('auth:sanctum')->post('/logout', [ApiTokenController::class, 'logout']);
});

Route::prefix('user')->middleware('auth:sanctum')->group(function () {
    Route::post('/changeImage', [UserController::class, 'patchUserImage']);
});

Route::prefix('')->middleware('auth:sanctum')->group(function () {
    Route::get('/me', [UserController::class, 'me']);
});

Route::prefix('notes')->middleware('auth:sanctum')->group(function () {
    Route::get('', [NoteController::class, 'createNewNote']);
    Route::get('all', [NoteController::class, 'list']);
    Route::get('{note}', [NoteController::class, 'find']);
    Route::post('{note}/upload', [NoteController::class, 'upload']);
    Route::patch('{note}', [NoteController::class, 'patch']);
});


Route::prefix('cloud')->middleware('auth:sanctum')->group(function () {
    Route::get('{dir_to_go?}', [NavigationController::class, 'navigate'])
        ->where('dir_to_go', '(.*)');
    Route::get('latest', [NavigationController::class, 'getRecentFiles']);
    Route::delete('file/{path}', [NavigationController::class, 'deleteFile'])
        ->where('path', '(.*)');
    Route::delete('dir/{path}', [NavigationController::class, 'deleteDir'])
        ->where('path', '(.*)');

});
