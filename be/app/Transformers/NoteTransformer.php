<?php

namespace App\Transformers;

use App\Models\Note;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use League\Fractal\TransformerAbstract;

class NoteTransformer extends TransformerAbstract
{

    public function transform(Note $note)
    {
        $manager = new Manager();
        $resource = new Collection($note->documents()->get(), new DocumentTransformer());
        $data = $manager->createData($resource)->toArray();

        return [
            'id' => $note->id,
            'title' => $note->title,
            'body' => $note->body,
            'created_by' => $note->created_by,
            'created_at' => $note->created_at,
            'updated_at' => $note->updated_at,
            'attachments' => $data,
        ];
    }
}
