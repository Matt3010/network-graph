<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckIfUploadedRequest;
use App\Utils\DocumentUtils;

class DocumentController extends Controller
{

    function checkIfUploaded(CheckIfUploadedRequest $request)
    {
        $documentUtils = new DocumentUtils();
        return response()->json($documentUtils->checkFileIfUploaded($request->path));
    }

}
