<?php

namespace App\Transformers;

use App\Models\User;
use Illuminate\Support\Facades\Storage;
use League\Fractal\TransformerAbstract;

class UserTransformer extends TransformerAbstract
{
    /**
     * Transform the User entity.
     *
     * @param User $user
     *
     * @return array
     */
    public function transform(User $user)
    {
        return [
            'id' => (int) $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'image_path' => $user->image_path ? Storage::disk('s3')->temporaryUrl($user->image_path, now()->addDay()): null,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
