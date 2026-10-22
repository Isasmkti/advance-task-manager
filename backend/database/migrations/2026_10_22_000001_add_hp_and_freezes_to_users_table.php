<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedSmallInteger('hp')->default(100)->after('timezone');
            $table->date('hp_date')->nullable()->after('hp'); // tanggal (zona waktu user) terakhir HP dipulihkan
            $table->unsignedTinyInteger('streak_freezes')->default(0)->after('hp_date');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['hp', 'hp_date', 'streak_freezes']);
        });
    }
};
