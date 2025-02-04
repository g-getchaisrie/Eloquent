<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $fillable = [
        'checkin_date',
        'checkout_date',
        'booking_date',
        'total'
    ];
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
    public function customer()
    {
        return $this->belongsTo(CustomerHotel::class);
    }
}
