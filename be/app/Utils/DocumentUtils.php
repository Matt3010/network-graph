<?php

namespace App\Utils;

use App\Models\Document;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class DocumentUtils
{
    public function upload(UploadedFile $file, ?String $path = null, ?Model $model = null)
    {
        $user = auth()->user();

        // ($file, $path) -> {$user->email}/$path -> per i file caricati dal manager dove l utente decide dove caricare
        // ($file, $model) -> {$user->email}/attachments/{$model->id} -> per i file caricati da una pagina dettaglio di una specifica entità (WIP, la pagina dettaglio potrebbe non esserci)
        // ($file) -> {$user->email}/attachments -> per i file caricati su una qualsiasi altra pagina

        $path = isset($path) ? "{$user->email}/$path" : ($model ? "{$user->email}/attachments/{$model->id}" : "{$user->email}/attachments");

        $uploaded = Storage::disk('s3')->putFileAs($path, $file, $file->getClientOriginalName());

        if ($uploaded) {
            $documentData = [
                'id' => uuid_create(),
                'url' => $uploaded,
                'mimetype' => $file->getMimeType(),
                'documentable_type' => $model ? get_class($model) : 'general',
                'documentable_id' => $model ? $model->id : uuid_create(),
            ];

            $document = new Document($documentData);

            if ($model) {
                return $model->documents()->save($document);
            } else {
                $document->save();
                return $document;
            }
        } else {
            return 'Error uploading file';
        }
    }

    public function checkFileIfUploaded($path)
    {
        $uploaded = Storage::disk('s3')->exists($path);
        return $uploaded ? true : false;
    }
}
