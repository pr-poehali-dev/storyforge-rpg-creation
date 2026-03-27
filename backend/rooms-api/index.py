import json
import os
import psycopg2
import psycopg2.extras


SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p12981526_storyforge_rpg_creat')


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'], options=f'-c search_path={SCHEMA}')


def handler(event: dict, context) -> dict:
    """
    CRUD API для игровых комнат.
    GET /        — список всех комнат с количеством игроков
    POST /       — создать комнату
    GET /{id}    — детали комнаты
    PATCH /{id}  — обновить название комнаты
    """
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    path_parts = [p for p in path.strip('/').split('/') if p]
    room_id = int(path_parts[-1]) if path_parts and path_parts[-1].isdigit() else None

    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    try:
        if method == 'GET' and room_id is None:
            cur.execute("""
                SELECT r.id, r.name, r.genre, r.description, r.story_intro,
                       r.max_players, r.status, r.creator, r.created_at,
                       COUNT(rp.id) AS players_count
                FROM rooms r
                LEFT JOIN room_players rp ON rp.room_id = r.id
                GROUP BY r.id
                ORDER BY r.created_at DESC
            """)
            rows = cur.fetchall()
            rooms = []
            for row in rows:
                r = dict(row)
                r['created_at'] = r['created_at'].isoformat()
                r['players_count'] = int(r['players_count'])
                rooms.append(r)
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'rooms': rooms}, ensure_ascii=False),
            }

        if method == 'GET' and room_id:
            cur.execute("SELECT * FROM rooms WHERE id = %s", (room_id,))
            row = cur.fetchone()
            if not row:
                return {'statusCode': 404, 'headers': cors_headers, 'body': json.dumps({'error': 'Комната не найдена'})}
            r = dict(row)
            r['created_at'] = r['created_at'].isoformat()
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'room': r}, ensure_ascii=False),
            }

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            name = body.get('name', '').strip()
            genre = body.get('genre', '').strip()
            description = body.get('description', '').strip()
            story_intro = body.get('story_intro', '').strip()
            max_players = int(body.get('max_players', 6))
            creator = body.get('creator', 'Аноним').strip()

            if not all([name, genre, description, story_intro]):
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Заполните все поля'}, ensure_ascii=False),
                }

            cur.execute(
                """INSERT INTO rooms (name, genre, description, story_intro, max_players, creator)
                   VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
                (name, genre, description, story_intro, max_players, creator)
            )
            new_id = cur.fetchone()['id']
            conn.commit()
            return {
                'statusCode': 201,
                'headers': cors_headers,
                'body': json.dumps({'id': new_id}, ensure_ascii=False),
            }

        if method == 'PATCH' and room_id:
            body = json.loads(event.get('body') or '{}')
            name = body.get('name', '').strip()
            if not name:
                return {'statusCode': 400, 'headers': cors_headers, 'body': json.dumps({'error': 'Имя обязательно'})}
            cur.execute("UPDATE rooms SET name = %s WHERE id = %s", (name, room_id))
            conn.commit()
            return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'ok': True})}

        return {'statusCode': 405, 'headers': cors_headers, 'body': json.dumps({'error': 'Method not allowed'})}

    finally:
        cur.close()
        conn.close()
