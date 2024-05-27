<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatchNote;
use App\Http\Requests\UploadDocumentRequest;
use App\Models\Note;
use App\Transformers\DocumentTransformer;
use App\Transformers\NoteTransformer;
use Illuminate\Http\Request;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;

class NoteController extends Controller
{
    public function createNewNote()
    {
        $note = new Note([
            'id' => uuid_create(),
            'title' => 'Note of the ' . now()->day . ' of ' . now()->monthName,
            'body' => null,
            'created_by' => auth()->user()->id,
        ]);

        $note->save();

        $manager = new Manager();
        $resource = new Item($note, new NoteTransformer());
        $data = $manager->createData($resource)->toArray();
        return response()->json($data);
    }

    public function list(Request $request)
    {
        $query = strtolower($request->input('q'));
        if ($query) {
            $notes = auth()
                ->user()
                ->notes()
                ->where('title', 'ILIKE', '%' . $query . '%')
                ->orWhere('body', 'ILIKE', '%' . $query . '%')
                ->get();
            if ($notes->count() === 0) {
                return response()->json('nothing found', 404);
            }
        } else {
            $notes = auth()->user()->notes()->get();
        }

        $manager = new Manager();
        $resource = new Collection($notes, new NoteTransformer());
        $data = $manager->createData($resource)->toArray();
        return response()->json($data);
    }

    public function find(Note $note)
    {
        $manager = new Manager();
        $resource = new Item($note, new NoteTransformer());
        $data = $manager->createData($resource)->toArray();
        return response()->json($data);
    }

    public function patch(Note $note, PatchNote $request)
    {
        $note->body = $request->body;
        $note->title = $request->title;
        if ($note->update()) {
            return response()->json('saved', 200);
        } else {
            return response()->json('Error saving note', 422);
        }
    }

    public function upload(UploadDocumentRequest $request, Note $note)
    {
        //middleware
        if (!$request->hasFile('attachment')) {
            return response()->json('You must upload an attachment!');
        }
        $attachment = $request->file('attachment');
        $res = $note->uploadDocument($attachment);

        $manager = new Manager();
        $resource = new Item($res, new DocumentTransformer());
        $data = $manager->createData($resource)->toArray();
        return response()->json($data);
    }
}
