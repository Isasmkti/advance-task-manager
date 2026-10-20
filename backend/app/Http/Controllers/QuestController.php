<?php

namespace App\Http\Controllers;

use App\Enums\Difficulty;
use App\Models\Quest;
use App\Services\XpService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class QuestController extends Controller
{
    /** GET /quests?status=active|completed */
    public function index(Request $request)
    {
        $query = Quest::where('user_id', $request->user()->id)->latest();

        if ($request->query('status') === 'active') {
            $query->whereNull('completed_at');
        } elseif ($request->query('status') === 'completed') {
            $query->whereNotNull('completed_at');
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        $quest = new Quest($data);
        $quest->user_id = $request->user()->id;
        $quest->save();

        return response()->json($quest->fresh(), 201);
    }

    public function show(Request $request, int $id)
    {
        return Quest::where('user_id', $request->user()->id)->findOrFail($id);
    }

    public function update(Request $request, int $id)
    {
        $quest = Quest::where('user_id', $request->user()->id)->findOrFail($id);

        if ($quest->completed_at) {
            abort(422, 'Quest yang sudah selesai tidak bisa diubah.');
        }

        $quest->update($this->validated($request, partial: true));

        return $quest->fresh();
    }

    public function destroy(Request $request, int $id)
    {
        Quest::where('user_id', $request->user()->id)
            ->findOrFail($id)
            ->delete();

        return response()->noContent();
    }

    /** POST /quests/{id}/complete */
    public function complete(Request $request, XpService $xp, int $id)
    {
        return response()->json($xp->complete($request->user(), $id));
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'difficulty' => ['sometimes', Rule::enum(Difficulty::class)],
            'due_at' => ['nullable', 'date'],
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->where('user_id', $request->user()->id),
            ],
        ]);
    }
}
