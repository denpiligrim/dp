<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    // Указываем таблицу
    protected $table = 'portfolio';

    // Разрешаем массовое заполнение полей
    protected $fillable = [
        'title',
        'title_en',
        'description',
        'description_en',
        'date',
        'img_preview',
        'img_1',
        'img_2',
        'img_3',
        'url',
        'githubUrl',
        'type',
        'technologies',
    ];

    // Касты типов полей
    protected $casts = [
        'date' => 'date',
    ];

    // Методы для работы с технологиями
    public function getTechnologiesArrayAttribute()
    {
        return explode(',', $this->technologies);
    }

    public function setTechnologiesAttribute($value)
    {
        $this->attributes['technologies'] = is_array($value) ? implode(',', $value) : $value;
    }
}