<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        return Category::where('user_id', $request->user()->id)
            ->orderBy('name')
            ->get();
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;

        $data = $request->validate([
            'name' => [
                'required', 'string', 'max:50',
                Rule::unique('categories', 'name')->where('user_id', $userId),
            ],
            'color' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $category = new Category($data);
        $category->user_id = $userId;
        $category->save();

        return response()->json($category->fresh(), 201);
    }

    public function update(Request $request, int $id)
    {
        $userId = $request->user()->id;
        $category = Category::where('user_id', $userId)->findOrFail($id);

        $data = $request->validate([
            'name' => [
                'sometimes', 'required', 'string', 'max:50',
                Rule::unique('categories', 'name')
                    ->where('user_id', $userId)
                    ->ignore($category->id),
            ],
            'color' => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $category->update($data);

        return $category;
    }

    public function destroy(Request $request, int $id)
    {
        Category::where('user_id', $request->user()->id)
            ->findOrFail($id)
            ->delete();

        return response()->noContent();
    }
}
