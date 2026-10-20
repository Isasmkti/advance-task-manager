# Task Manager - Next.js & Laravel
Task manager app made with Next.js and Laravel Framework   for learning purpose.

# Run Project
```bash
cd ./backend
# hold on, setup your db before.
php artisan serve

cd ./frontend
npm run dev
```
# Api doc
POST /api/register dan POST /api/login mengembalikan token dan data hero
GET /api/me mengembalikan level, total XP, dan batas XP level sekarang dan berikutnya (untuk progress bar)
POST /api/logout
CRUD /api/categories dan /api/quests (daftar quest bisa difilter ?status=active atau ?status=completed)
POST /api/quests/{id}/complete memberi XP dan menaikkan level