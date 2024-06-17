<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatchNote;
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
        $sort = strtolower($request->input('s'));
        if ($query) {
            $notes = auth()
                ->user()
                ->notes()
                ->where('title', 'ILIKE', '%' . $query . '%')
                ->orWhere('body', 'ILIKE', '%' . $query . '%')
                ->orderBy('created_at', $sort ?: 'desc')
                ->get();
            if ($notes->count() === 0) {
                return response()->json('nothing found', 404);
            }
        } else {
            $notes = auth()->user()->notes()->orderBy('created_at', $sort ?: 'desc')->get();
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

    public function patch(Note $note, Request $request)
    {
        $note->body = $request->body;
         if ($note->update()) {
             $manager = new Manager();
             $resource = new Item($note, new NoteTransformer());
             $data = $manager->createData($resource)->toArray();
             return response()->json($data);
        } else {
            return response()->json('Error saving note', 422);
        }
    }

    public function upload(Request $request, Note $note)
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
