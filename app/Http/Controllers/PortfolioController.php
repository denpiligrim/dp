<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Portfolio;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $query = Portfolio::query();

        // Фильтрация по диапазону дат
        if ($request->has(['date_from', 'date_to'])) {
            $query->whereBetween('date', [$request->date_from, $request->date_to]);
        }

        // Фильтрация по типу
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Фильтрация по технологиям
        if ($request->has('technologies')) {
            $technologies = explode(',', $request->technologies);
            $query->where(function ($q) use ($technologies) {
                foreach ($technologies as $tech) {
                    $q->orWhere('technologies', 'like', "%$tech%");
                }
            });
        }

        // Сортировка
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'newest':
                    $query->orderBy('date', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('date', 'asc');
                    break;
                case 'a-z':
                    $query->orderBy('title', 'asc');
                    break;
                case 'z-a':
                    $query->orderBy('title', 'desc');
                    break;
            }
        }

        return response()->json($query->get());
    }
}