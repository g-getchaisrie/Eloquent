<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    protected $fillable = [
        'number',
        'status'
    ];
    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
