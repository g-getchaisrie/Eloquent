<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'credit',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function registers()
    {
        return $this->hasMany(Register::class);
    }
}
