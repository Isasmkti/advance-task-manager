<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quests', function (Blueprint $table) {
            // Diisi saat quest lewat deadline dan sudah diproses penaltinya (agar tidak dihitung dua kali).
            $table->dateTime('penalized_at')->nullable()->after('completed_at');
            $table->index(['user_id', 'penalized_at', 'due_at']);
        });
    }

    public function down(): void
    {
        Schema::table('quests', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'penalized_at', 'due_at']);
            $table->dropColumn('penalized_at');
        });
    }
};
