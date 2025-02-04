<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Register extends Model
{
    use HasFactory;
    protected $fillable = [
        'register_date',
        'grade'
    ];

    public function students()
    {
        return $this->belongsToMany(Student::class);
    }
    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }
}
