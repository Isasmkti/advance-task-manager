# Task Manager - Next.js & Laravel
Task manager app made with Next.js and Laravel Framework   for learning purpose.

# Run Project
```bash
# buld and setup
docker compose up -d --build
docker exec laravel_backend php artisan migrate
# migrate check
docker exec laravel_backend php artisan migrate:status
# if you want to stop or run again
docker compose stop
docker compose start
# or release ram for other proccess
docker compose down 
wsl --shutdown
```
# Api doc
POST /api/register dan POST /api/login mengembalikan token dan data hero
GET /api/me mengembalikan level, total XP, dan batas XP level sekarang dan berikutnya (untuk progress bar)
POST /api/logout
CRUD /api/categories dan /api/quests (daftar quest bisa difilter ?status=active atau ?status=completed)
POST /api/quests/{id}/complete memberi XP dan menaikkan level