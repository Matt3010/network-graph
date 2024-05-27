<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Transformers\NavigationTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;

class NavigationController extends Controller
{

    public function navigate(string $dir_to_go = null)
    {
        $directories = Storage::disk('s3')->directories(auth()->user()->email.'/attachments/'.$dir_to_go);
        $files = Storage::disk('s3')->files(auth()->user()->email.'/attachments/'.$dir_to_go);
        $items = [];
        foreach ($directories as $dir) {
            $items[] = (object)['path' => $dir];
        }
        foreach ($files as $file) {
            $items[] = (object)['path' => $file, 'signed_url' => Storage::disk('s3')->temporaryUrl($file, now()->addDay())];
        }

        $manager = new Manager();
        $resource = new Collection($items, new NavigationTransformer());
        $data = $manager->createData($resource)->toArray();
        return response()->json($data);
    }


    public function deleteFile($path)
    {
        if (!Storage::disk('s3')->exists($path)) {
            return response()->json(['error' => 'File not found.'], 404);
        }
        if (Storage::disk('s3')->delete($path)) {
            return response()->json(['message' => 'File deleted successfully.'], 200);
        } else {
            return response()->json(['error' => 'Failed to delete file.'], 500);
        }
    }
    public function deleteDir($path)
    {
        if (!Storage::disk('s3')->exists($path)) {
            return response()->json(['error' => 'Directory not found.'], 404);
        }
        if (Storage::disk('s3')->deleteDirectory($path)) {
            return response()->json(['message' => 'Directory deleted successfully.'], 200);
        } else {
            return response()->json(['error' => 'Delete file or directory.'], 500);
        }
    }

    public function getRecentFiles() {
        $recentFiles = auth()->user()->documents()->latest()->take(7)->get();
        return response()->json($recentFiles, 200);
    }



}
