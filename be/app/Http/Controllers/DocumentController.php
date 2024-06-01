<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckIfUploadedRequest;
use App\Http\Requests\UploadDocumentRequest;
use App\Transformers\DocumentTransformer;
use App\Utils\DocumentUtils;
use Illuminate\Http\Request;
use League\Fractal\Manager;
use League\Fractal\Resource\Item;

class DocumentController extends Controller
{

    function checkIfUploaded(CheckIfUploadedRequest $request)
    {
        $documentUtils = new DocumentUtils();
        return response()->json($documentUtils->checkFileIfUploaded($request->path));
    }

    function upload(Request $request)
    {
        if (!$request->hasFile('attachment')) {
            return response()->json('You must upload an attachment!');
        }
        $attachment = $request->file('attachment');
        $documentUtils = new DocumentUtils();

        $res = $documentUtils->upload($attachment, $request->path);

        $manager = new Manager();
        $resource = new Item($res, new DocumentTransformer());
        $data = $manager->createData($resource)->toArray();
        return response()->json($data);
    }

}
