<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WishlistController extends Controller
{
    private function owner(Request $request): string
    {
        $token = $request->header('X-Wishlist-Token', '');
        if (!preg_match('/\A[a-f0-9]{64}\z/', $token)) {
            throw ValidationException::withMessages(['token' => 'Некорректный ключ браузера.']);
        }

        return hash('sha256', $token);
    }

    private function items(string $owner)
    {
        return DB::table('wishlist')->orderBy('id')->get()->map(fn ($item) => [
            'id' => $item->id,
            'name' => $item->name,
            'occupied' => (bool) $item->occupied,
            'mine' => $item->occupied && hash_equals($owner, $item->reservation_hash ?? ''),
        ]);
    }

    public function index(Request $request)
    {
        return response()->json(['items' => $this->items($this->owner($request))])
            ->header('Cache-Control', 'no-store');
    }

    public function update(Request $request)
    {
        $owner = $this->owner($request);
        $data = $request->validate([
            'ids' => 'present|array|max:1000',
            'ids.*' => 'required|integer|min:1|distinct',
        ]);
        $ids = array_map('intval', $data['ids']);

        return DB::transaction(function () use ($ids, $owner) {
            // A consistent lock order serializes reservations, including releases.
            $rows = DB::table('wishlist')->orderBy('id')->lockForUpdate()->get();
            $selected = $rows->whereIn('id', $ids);
            if ($selected->count() !== count($ids)) {
                return response()->json(['message' => 'Список изменился. Обновите его и повторите выбор.'], 409);
            }
            foreach ($selected as $item) {
                if ($item->occupied && !hash_equals($owner, $item->reservation_hash ?? '')) {
                    return response()->json(['message' => 'Один из подарков уже занят. Список обновлён — проверьте выбор.'], 409);
                }
            }

            DB::table('wishlist')->where('reservation_hash', $owner)->whereNotIn('id', $ids)
                ->update(['occupied' => false, 'reservation_hash' => null]);
            if ($ids) {
                DB::table('wishlist')->whereIn('id', $ids)
                    ->update(['occupied' => true, 'reservation_hash' => $owner]);
            }

            return response()->json(['items' => $this->items($owner)])->header('Cache-Control', 'no-store');
        }, 3);
    }
}
