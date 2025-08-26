<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StatusResource;
use App\Models\Status;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function index()
    {
        $resource = Status::get();

        StatusResource::withoutWrapping();
        return StatusResource::collection($resource);
    }
}
