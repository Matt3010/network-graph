<?php

namespace App\Models;

use App\Utils\DocumentUtils;
use Carbon\Traits\Timestamp;
use Illuminate\Database\Eloquent\Concerns\HasTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\File;

class Note extends Model
{
    use HasFactory, SoftDeletes, Timestamp;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'body',
        'created_at',
        'updated_at',
        'created_by',
    ];

    /**
     * Get the user that owns the note.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    /**
     * Upload a document for this note.
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @return \App\Models\Document
     */
    public function uploadDocument($file)
    {
        $documentUtils = new DocumentUtils();
        return $documentUtils->upload($file,null, $this);
    }
}
