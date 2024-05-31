<?php

namespace App\Transformers;

use App\Models\Document;
use App\Models\Note;
use Illuminate\Support\Facades\Storage;
use League\Fractal\TransformerAbstract;

class DocumentTransformer extends TransformerAbstract
{
    public function transform(Document $document)
    {
        return [
            'id' => $document->id,
            'created_at' => $document->created_at,
            'updated_at' => $document->updated_at,
            'url' => $document->url ? Storage::disk('s3')->temporaryUrl($document->url, now()->addDay()): null,
            'default_url' => $document->url,
            'filetype' => $document->mimetype,
        ];
    }
}
