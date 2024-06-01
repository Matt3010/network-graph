<?php

namespace App\Http\Controllers;

use App\Transformers\UserTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use League\Fractal\Manager;
use League\Fractal\Resource\Item;

class UserController extends Controller
{
    public function patchUserImage(Request $request)
    {
        $user = auth()->user();

        if (!$request->hasFile('file')) {
            return response()->json(['message' => 'No file uploaded'], 400);
        }

        $file = $request->file('file');
        $uploaded = Storage::disk('s3')->put("{$user->email}/avatar", $file);

        if ($uploaded) {
            $user->image_path = $uploaded;
            $user->save();
            return response()->json(['message' => 'File uploaded successfully', 'file' => $uploaded], 200);
        }
    }


    public function me(Request $request)
    {
        $manager = new Manager();
        $resource = new Item($request->user(), new UserTransformer);
        $data = $manager->createData($resource)->toArray();
        return response()->json($data['data']);
    }
}
