<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('coins')->default(0)->after('total_xp');
            $table->unsignedSmallInteger('current_streak')->default(0)->after('coins');
            $table->unsignedSmallInteger('longest_streak')->default(0)->after('current_streak');
            $table->date('last_completed_on')->nullable()->after('longest_streak');
            $table->string('timezone', 64)->default('Asia/Jakarta')->after('last_completed_on');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'coins',
                'current_streak',
                'longest_streak',
                'last_completed_on',
                'timezone',
            ]);
        });
    }
};
