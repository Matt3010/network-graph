<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApiTokenLoginGoogleRequest;
use App\Http\Requests\ApiTokenLoginRequest;
use App\Http\Requests\ApiTokenRegisterRequest;
use App\Models\User;
use App\Transformers\UserTransformer;
use Google_Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use League\Fractal\Manager;
use League\Fractal\Resource\Item;

class ApiTokenController extends Controller
{
    public function register(ApiTokenRegisterRequest $request)
    {
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['error' => "User already register"], 409);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $token = $user->createToken($request->token_name, ['*'], now()->addDay());

        // Abilities
        //$token = $user->createToken($request->token_name, ['repo:view', 'repo:create']);

        $manager = new Manager();
        $resource = new Item($user, new UserTransformer);
        $data = $manager->createData($resource)->toArray();

        return [
            'token' => $token->plainTextToken,
            'user' => $data['data']
        ];
    }

    public function login(ApiTokenLoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!isset($user)) {
            return response()->json(['error' => "You must first register to access with Google."], 404);
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => "Invalid credentials"], 401);
        }

        $user->tokens()->where('name', $request->token_name)->delete();

        $token = $user->createToken($request->token_name, ['*'], now()->addDay());
        // Abilities
        //$token = $user->createToken($request->token_name, ['repo:view']);

        $manager = new Manager();
        $resource = new Item($user, new UserTransformer);
        $data = $manager->createData($resource)->toArray();

        return [
            'token' => $token->plainTextToken,
            'user' => $data['data']
        ];
    }

    public function loginWithGoogle(ApiTokenLoginGoogleRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!isset($user)) {
            return response()->json(['error' => "You must first register to access with Google."], 404);
        }

        $client = new Google_Client(['client_id' => '692071661141-94h5cqooal7ggcmsub5t346itmfjcji2.apps.googleusercontent.com']);  // Specify the CLIENT_ID of the app that accesses the backend
        $payload = $client->verifyIdToken($request->idToken);
        if (!$payload) {
            return response()->json(['error' => "Google unauthorized"], 401);
        }

        $user->tokens()->where('name', 'google-login')->delete();

        $token = $user->createToken('google-login', ['*'], now()->addDay());
        // Abilities
        //$token = $user->createToken($request->token_name, ['repo:view']);

        $manager = new Manager();
        $resource = new Item($user, new UserTransformer);
        $data = $manager->createData($resource)->toArray();

        return [
            'token' => $token->plainTextToken,
            'user' => $data['data'],
            'payload-google-token' => $payload
        ];
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response(null, 204);
    }
}
