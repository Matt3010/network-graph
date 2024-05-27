<?php
namespace App\Transformers;
use League\Fractal\TransformerAbstract;

class NavigationTransformer extends TransformerAbstract
{
    public function transform($item)
    {
        if (isset($item->signed_url)) {
            // Se è un file
            return [
                'type' => 'file',
                'path' => explode(auth()->user()->email.'/attachments', $item->path)[1],
                'signed_url' => $item->signed_url,
            ];
        } else {
            // Se è una directory
            return [
                'type' => 'directory',
                'path' => explode(auth()->user()->email.'/attachments', $item->path)[1],
            ];
        }
    }
}
