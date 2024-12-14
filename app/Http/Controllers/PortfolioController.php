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
        if ($request->has(['date_from', 'date_to']) && isset($request->date_from) && isset($request->date_to)) {
            $query->whereBetween('date', [$request->date_from, $request->date_to]);
        }

        // Фильтрация по типу
        if ($request->has('type') && isset($request->type)) {
            if ($request->type !== "all") {
                $query->where('type', $request->type);
            }
        }

        // Фильтрация по технологиям
        if ($request->has('technologies') && isset($request->technologies)) {
            $technologies = explode(',', $request->technologies);
            $query->where(function ($q) use ($technologies) {
                foreach ($technologies as $tech) {
                    $q->orWhere('technologies', 'like', "%$tech%");
                }
            });
        }

        // Сортировка
        if ($request->has('sort') && isset($request->sort)) {
            switch ($request->sort) {
                case 'newest':
                    $query->orderBy('date', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('date', 'asc');
                    break;
                case 'az':
                    $query->orderBy('title', 'asc');
                    break;
                case 'za':
                    $query->orderBy('title', 'desc');
                    break;
            }
        } else {
            $query->orderBy('date', 'desc');
        }

        return response()->json($query->get());
    }
}
