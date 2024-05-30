<?php

namespace App\Utils;

use App\Models\Document;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class DocumentUtils
{
    public function uploadForEntity($file, Model $model)
    {
        $user = auth()->user();

        $uploaded = Storage::disk('s3')->put("{$user->email}/attachments/{$model->id}", $file);

        if ($uploaded) {
            $document = new Document([
                'id' => uuid_create(),
                'url' => $uploaded,
            ]);
            return $model->documents()->save($document);
        } else {
            return 'Error uploading file';
        }
    }


    public function uploadForGeneral($file, Model $model, $path)
    {
        $user = auth()->user();

        $uploaded = Storage::disk('s3')->put("{$user->email}/attachments", $file);

        if ($uploaded) {
            $document = new Document([
                'id' => uuid_create(),
                'url' => $uploaded,
            ]);
            return $model->documents()->save($document);
        } else {
            return 'Error uploading file';
        }
    }

    public function checkFileIfUploaded($path) {
        $uploaded = Storage::disk('s3')->exists($path);
        return $uploaded ? true : false;
    }
}
